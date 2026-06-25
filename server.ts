import express from "express";
import path from "path";
import fs from "fs";
import https from "https";

// Google Drive BGM file IDs for progressive local download caching
const BGM_DRIVE_IDS: Record<string, string> = {
  cover: '1W93M9AIU9e21lOi2-VDdPRdg8PuasdAu',
  ending: '1OaeIOdis5Xww4VNlIQvgF7u9BkMLpXQY',
  food: '1_7r_gg0Za5rC36jq1YoAKtrQJP4Uq77L', // Updated BGM according to user request
  battle_uganda: '1SylhUEPQBI19JSJLQaAobHgrGET_n0Ze',
  battle_fang: '1OWkdjVzbnCDZxzF7XCX4UiFeWAff5yPn',
  battle_yamamoto: '1Zfp6sO76Bl5NgeMHI6Ho3SzZ6Es-4W8Y',
  battle_murashita: '1OWkdjVzbnCDZxzF7XCX4UiFeWAff5yPn',
  baoshan: '1WZQaww4_DVJ5tZUwsOwUHsLxZAFmIB_H',
  shrine: '1Iu-61McZQPNK-snE2Ct18avyr5zW_E3D',
  ch_high: '16oCCB3_C_6VvmvQijluw0Qz-1sK5oiqh',
  huayang: '1OliER0rlo9cfF1F1KahyVeWx1sbFx0vW',
  council: '1xYLt4XOo9-h-IUyJEw7Q_-jgPIoWRqKI',
  zhongshan_ele: '1zcG8SOF4U8nUI2Av2P1AfHcwvuqUIzSd',
  seafood_supermarket: '1t0SMiXFCNDJLbd4U2fCnmujktIGTgImB',
  zhongshan_soy: '1adqa23PCqpTtcFz9bHJrXHRkWHguSxiW',
  jinde: '1KzZSOa1QicSt_ZWTUKE07korIPhMpv76'
};

// Map tracks to human readable names for UI display
const BGM_NAMES: Record<string, string> = {
  cover: '封面主題曲 (Cover Theme)',
  ending: '結局背景音樂 (Ending Theme)',
  food: '選擇食物音樂 (Food Selection Theme)',
  battle_uganda: '烏干達戰鬥 (Battle Uganda)',
  battle_fang: '方戰鬥 (Battle Fang)',
  battle_yamamoto: '山本戰鬥 (Battle Yamamoto)',
  battle_murashita: '村下戰鬥 (Battle Murashita)',
  baoshan: '寶山校區 (Baoshan Campus)',
  shrine: '忠靈祠神社 (Shrine Theme)',
  ch_high: '彰化高中 (Changhua High)',
  huayang: '華陽市場 (Huayang Market)',
  council: '彰化縣議會 (Council)',
  zhongshan_ele: '中山國小 (Zhongshan Elementary)',
  seafood_supermarket: '喜美超市 (Seafood Supermarket)',
  zhongshan_soy: '中山豆漿 (Zhongshan Soy Milk)',
  jinde: '進德校區 (Jinde Campus)'
};

// Safe cache path routing helper with automatic fallback to writable /tmp on read-only environments
function getCacheDir(subType: 'music' | 'images'): { primary: string; fallback: string; active: string } {
  const primary = path.join(process.cwd(), 'public', subType);
  const fallback = path.join('/tmp', 'applet-cache', subType);
  
  let active = primary;
  try {
    if (!fs.existsSync(primary)) {
      fs.mkdirSync(primary, { recursive: true });
    }
    // Test write permission on primary path
    const testFile = path.join(primary, '.write-test-' + Date.now());
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
  } catch (e) {
    // Falls back seamlessly to /tmp inside Cloud Run / read-only settings
    active = fallback;
    try {
      if (!fs.existsSync(fallback)) {
        fs.mkdirSync(fallback, { recursive: true });
      }
    } catch (err) {
      console.error(`[Cache Router] Failed to create fallback directory for ${subType}:`, err);
    }
  }
  return { primary, fallback, active };
}

// Find local file in either primary server directories or /tmp fallback directory
function findAssetFile(subType: 'music' | 'images', fileName: string): string | null {
  const dirs = getCacheDir(subType);
  const primaryPath = path.join(dirs.primary, fileName);
  const fallbackPath = path.join(dirs.fallback, fileName);

  try {
    if (fs.existsSync(primaryPath) && fs.statSync(primaryPath).size > 1000) {
      return primaryPath;
    }
  } catch (e) {}

  try {
    if (fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).size > 1000) {
      return fallbackPath;
    }
  } catch (e) {}

  return null;
}

// Simple helper to download file with dynamic HTTP redirect tracking (status 3xx)
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let file: fs.WriteStream;
    let requestDestroyed = false;
    let clientReq: any = null;

    try {
      // Ensure directory exists first
      const parentDir = path.dirname(dest);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      file = fs.createWriteStream(dest);
      file.on('error', (err) => {
        try {
          file.end();
          fs.unlink(dest, () => {});
        } catch (e) {}
        reject(err);
      });
    } catch (err) {
      reject(err);
      return;
    }

    const request = (targetUrl: string) => {
      try {
        clientReq = https.get(targetUrl, (response) => {
          if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            // Follow redirect
            request(response.headers.location);
            return;
          }

          if (response.statusCode !== 200) {
            try {
              file.end();
              fs.unlink(dest, () => {});
            } catch (e) {}
            reject(new Error(`Server returned HTTP code: ${response.statusCode}`));
            return;
          }

          response.pipe(file);
          
          file.on('finish', () => {
            file.close();
            resolve();
          });
        });

        // Set 15-second timeout to prevent stalling of connection or raw hang
        clientReq.setTimeout(15000, () => {
          if (requestDestroyed) return;
          requestDestroyed = true;
          clientReq.destroy();
          try {
            file.end();
            fs.unlink(dest, () => {});
          } catch (e) {}
          reject(new Error(`Connection/Response Timeout for Google Drive download`));
        });

        clientReq.on('error', (err: any) => {
          if (requestDestroyed) return;
          try {
            file.end();
            fs.unlink(dest, () => {});
          } catch (e) {}
          reject(err);
        });
      } catch (err) {
        try {
          file.end();
          fs.unlink(dest, () => {});
        } catch (e) {}
        reject(err);
      }
    };

    request(url);
  });
}

// Global active sync flag to prevent simultaneous download runs
let isSyncing = false;

// Background worker downloading original game MP3 soundtracks
async function ensureMusicDownloaded() {
  const dirs = getCacheDir('music');
  console.log(`[BGM Syncer] Active write directory: ${dirs.active}`);

  // Unconditionally delete the older cached food.mp3 file on boot up to ensure the newly supplied BGM is downloaded
  try {
    const primaryFoodPath = path.join(dirs.primary, 'food.mp3');
    const fallbackFoodPath = path.join(dirs.fallback, 'food.mp3');
    if (fs.existsSync(primaryFoodPath)) {
      fs.unlinkSync(primaryFoodPath);
      console.log(`[BGM Syncer] Unlinked stale primary food BGM cache successfully.`);
    }
    if (fs.existsSync(fallbackFoodPath)) {
      fs.unlinkSync(fallbackFoodPath);
      console.log(`[BGM Syncer] Unlinked stale fallback food BGM cache successfully.`);
    }
  } catch (err: any) {
    console.warn(`[BGM Syncer] Non-blocking warning resetting food BGM cache file: ${err.message}`);
  }

  for (const [key, id] of Object.entries(BGM_DRIVE_IDS)) {
    const destPath = path.join(dirs.active, `${key}.mp3`);
    
    // Skip if already downloaded in either location
    if (findAssetFile('music', `${key}.mp3`)) {
      continue;
    }

    const downloadUrl = `https://docs.google.com/uc?export=download&id=${id}`;
    console.log(`[BGM Syncer] Pre-caching BGM ${key}.mp3 to ${destPath}...`);
    
    try {
      await downloadFile(downloadUrl, destPath);
      console.log(`[BGM Syncer] -> Cached successfully: ${key}.mp3`);
      await new Promise(r => setTimeout(r, 150));
    } catch (err: any) {
      console.warn(`[BGM Syncer] -> Cached failed for ${key}.mp3: ${err.message}`);
    }
  }
}

// Scans src/data.ts for hosted image files
function scanHostedImageIds(): Set<string> {
  const uniqueIds = new Set<string>();
  const dataPath = path.join(process.cwd(), 'src', 'data.ts');
  if (!fs.existsSync(dataPath)) {
    return uniqueIds;
  }

  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  const matches = fileContent.matchAll(/https:\/\/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/g);
  for (const match of matches) {
    if (match[1]) {
      uniqueIds.add(match[1]);
    }
  }
  return uniqueIds;
}

// Auto-extract and download all image file resources from data.ts
async function ensureImagesDownloaded() {
  const dirs = getCacheDir('images');
  console.log(`[Image Syncer] Active write directory: ${dirs.active}`);

  const uniqueIds = scanHostedImageIds();
  console.log(`[Image Syncer] Successfully scanned ${uniqueIds.size} unique hosted assets in data.ts.`);

  for (const fileId of uniqueIds) {
    const destPath = path.join(dirs.active, `${fileId}.png`);

    if (findAssetFile('images', `${fileId}.png`)) {
      continue;
    }

    const downloadUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
    console.log(`[Image Syncer] Pre-caching asset ${fileId}.png...`);

    try {
      await downloadFile(downloadUrl, destPath);
      console.log(`[Image Syncer] Cached ${fileId}.png successfully.`);
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (err: any) {
      console.warn(`[Image Syncer] Warning: Pre-cache failed for ${fileId}: ${err.message}`);
    }
  }
  console.log(`[Image Syncer] Asset downloading queue finished.`);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Delayed background assets pre-cacher to guarantee instant port-binding and health checks
  setTimeout(() => {
    console.log("[BGM & Image Syncer] Starting delayed background pre-caching...");
    ensureMusicDownloaded().catch(console.error);
    ensureImagesDownloaded().catch(console.error);
  }, 8000);

  // Health probe API endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // Assets download check status API for settings panels
  app.get("/api/assets-status", (req, res) => {
    try {
      const musicKeys = Object.keys(BGM_DRIVE_IDS);
      const bgmList = musicKeys.map(key => {
        const fileName = `${key}.mp3`;
        const localPath = findAssetFile('music', fileName);
        let size: number | null = null;
        if (localPath) {
          try {
            size = fs.statSync(localPath).size;
          } catch(e) {}
        }
        return {
          key,
          id: BGM_DRIVE_IDS[key],
          name: BGM_NAMES[key] || key,
          status: localPath ? 'local' : 'remote',
          size
        };
      });

      const uniqueImageIds = Array.from(scanHostedImageIds());
      const imagesList = uniqueImageIds.map(id => {
        const fileName = `${id}.png`;
        const localPath = findAssetFile('images', fileName);
        let size: number | null = null;
        if (localPath) {
          try {
            size = fs.statSync(localPath).size;
          } catch(e) {}
        }
        return {
          id,
          status: localPath ? 'local' : 'remote',
          size
        };
      });

      const totalBgm = bgmList.length;
      const cachedBgm = bgmList.filter(b => b.status === 'local').length;
      const totalImages = imagesList.length;
      const cachedImages = imagesList.filter(i => i.status === 'local').length;

      res.json({
        success: true,
        bgmList,
        imagesList,
        isSyncing,
        stats: {
          totalBgm,
          cachedBgm,
          totalImages,
          cachedImages,
          allCached: cachedBgm === totalBgm && cachedImages === totalImages
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Trigger cache synchronization manually
  app.post("/api/assets-sync", async (req, res) => {
    if (isSyncing) {
      return res.json({ success: true, message: "Sync already in progress" });
    }

    isSyncing = true;
    res.json({ success: true, message: "Asset synchronizer initiated in background" });

    // Download in background
    (async () => {
      try {
        console.log(`[Manual Syncer] Initiated manually triggered cache sync...`);
        const musicDirs = getCacheDir('music');
        for (const [key, id] of Object.entries(BGM_DRIVE_IDS)) {
          if (!findAssetFile('music', `${key}.mp3`)) {
            try {
              await downloadFile(`https://docs.google.com/uc?export=download&id=${id}`, path.join(musicDirs.active, `${key}.mp3`));
              await new Promise(r => setTimeout(r, 100));
            } catch (e: any) {
              console.error(`[Manual Syncer] Sound sync failed for ${key}:`, e.message);
            }
          }
        }

        const imageDirs = getCacheDir('images');
        const uniqueImageIds = scanHostedImageIds();
        for (const fileId of uniqueImageIds) {
          if (!findAssetFile('images', `${fileId}.png`)) {
            try {
              await downloadFile(`https://docs.google.com/uc?export=download&id=${fileId}`, path.join(imageDirs.active, `${fileId}.png`));
              await new Promise(r => setTimeout(r, 150));
            } catch (e: any) {
              console.error(`[Manual Syncer] Image sync failed for ${fileId}:`, e.message);
            }
          }
        }
        console.log(`[Manual Syncer] Manual sync complete!`);
      } catch (err) {
        console.error(`[Manual Syncer] Background sync process errored:`, err);
      } finally {
        isSyncing = false;
      }
    })();
  });

  // Self-healing, high-speed on-the-fly Image Cache proxy
  const handleImageRequest = (req: any, res: any) => {
    const fileId = req.params.id.replace('.png', '');
    
    // Serve local cache if already present
    const localPath = findAssetFile('images', `${fileId}.png`);
    if (localPath) {
      return res.sendFile(localPath);
    }

    // Otherwise: Fetch from Google Drive, stream to client instantly, and cache locally concurrently
    const dirs = getCacheDir('images');
    const cachePath = path.join(dirs.active, `${fileId}.png`);
    const downloadUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    
    const requestUrl = (targetUrl: string) => {
      try {
        https.get(targetUrl, (driveRes) => {
          if (driveRes.statusCode && driveRes.statusCode >= 300 && driveRes.statusCode < 400 && driveRes.headers.location) {
            requestUrl(driveRes.headers.location);
            return;
          }

          if (driveRes.statusCode === 200) {
            res.setHeader('Content-Type', driveRes.headers['content-type'] || 'image/png');
            driveRes.pipe(res);
            try {
              const cacheStream = fs.createWriteStream(cachePath);
              cacheStream.on('error', (err) => {
                console.error(`[Image Proxy Cache Stream Error] fileId ${fileId}:`, err);
              });
              driveRes.pipe(cacheStream);
            } catch (err) {
              console.error(`[Image Proxy Cache Write Error] fileId ${fileId}:`, err);
            }
          } else {
            res.status(driveRes.statusCode || 500).send("Error loading image from Google Drive");
          }
        }).on('error', (err) => {
          console.error(`[Image Proxy Exception] fileId ${fileId}:`, err);
          if (!res.headersSent) {
            res.status(500).send("Connection Exception");
          }
        });
      } catch (err: any) {
        console.error(`[Image Proxy Sync Exception] fileId ${fileId}:`, err);
        if (!res.headersSent) {
          res.status(500).send("Proxy Exception");
        }
      }
    };

    requestUrl(downloadUrl);
  };

  app.get("/images/:id", handleImageRequest);
  app.get("/images/:id.png", handleImageRequest);

  // Self-healing, high-speed on-the-fly Music Cache proxy
  const handleMusicRequest = (req: any, res: any) => {
    const trackKey = req.params.track.replace('.mp3', '');

    // Serve local cache if already present
    const localPath = findAssetFile('music', `${trackKey}.mp3`);
    if (localPath) {
      if (trackKey.includes('food')) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
      return res.sendFile(localPath);
    }

    const fileId = BGM_DRIVE_IDS[trackKey];
    if (!fileId) {
      return res.status(404).send("BGM Track not registered");
    }

    const dirs = getCacheDir('music');
    const cachePath = path.join(dirs.active, `${trackKey}.mp3`);
    const downloadUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
    
    const requestUrl = (targetUrl: string) => {
      try {
        https.get(targetUrl, (driveRes) => {
          if (driveRes.statusCode && driveRes.statusCode >= 300 && driveRes.statusCode < 400 && driveRes.headers.location) {
            requestUrl(driveRes.headers.location);
            return;
          }

          if (driveRes.statusCode === 200) {
            res.setHeader('Content-Type', driveRes.headers['content-type'] || 'audio/mpeg');
            res.setHeader('Accept-Ranges', 'bytes');
            if (trackKey.includes('food')) {
              res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
              res.setHeader("Pragma", "no-cache");
              res.setHeader("Expires", "0");
            }
            driveRes.pipe(res);
            try {
              const cacheStream = fs.createWriteStream(cachePath);
              cacheStream.on('error', (err) => {
                console.error(`[Music Proxy Cache Stream Error] trackKey ${trackKey}:`, err);
              });
              driveRes.pipe(cacheStream);
            } catch (err) {
              console.error(`[Music Proxy Cache Write Error] trackKey ${trackKey}:`, err);
            }
          } else {
            res.status(driveRes.statusCode || 500).send("Error loading sound from Google Drive");
          }
        }).on('error', (err) => {
          console.error(`[Music Proxy Exception] ${trackKey}:`, err);
          if (!res.headersSent) {
            res.status(500).send("Connection Exception");
          }
        });
      } catch (err: any) {
        console.error(`[Music Proxy Sync Exception] ${trackKey}:`, err);
        if (!res.headersSent) {
          res.status(500).send("Proxy Exception");
        }
      }
    };

    requestUrl(downloadUrl);
  };

  app.get("/music/:track.mp3", handleMusicRequest);
  app.get("/music/:track", handleMusicRequest);

  // Mount express.static for dynamic directories to serve caches under /music and /images from primary AND fallback directories
  app.use('/music', (req, res, next) => {
    const fileName = req.url.replace(/^\//, ''); // e.g. cover.mp3
    const localPath = findAssetFile('music', fileName);
    if (localPath) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Accept-Ranges", "bytes");
      if (fileName.includes('food')) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
      return res.sendFile(localPath);
    }
    next();
  });

  app.use('/images', (req, res, next) => {
    const fileName = req.url.replace(/^\//, ''); // e.g. asset.png
    const localPath = findAssetFile('images', fileName);
    if (localPath) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.sendFile(localPath);
    }
    next();
  });

  // Serve main application assets
  const distPath = path.join(process.cwd(), 'dist');
  
  // Robust production detection:
  // 1. Explicit NODE_ENV === "production"
  // 2. Or distPath exists AND we are NOT running server.ts directly via tsx (which would have server.ts in argv[1])
  const isRunningTs = process.argv[1] && process.argv[1].endsWith('server.ts');
  const isProd = process.env.NODE_ENV === "production" || (fs.existsSync(distPath) && !isRunningTs);

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath, {
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Accept-Ranges", "bytes");
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=== FULL STACK SERVER ONLINE ===`);
    console.log(`Listening dynamically at http://localhost:${PORT}`);
  });
}

startServer();
