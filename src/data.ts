/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DialogueStep, Food } from './types';

export const IMG = {
  // Characters
  安婷: 'https://lh3.googleusercontent.com/d/1tUD84UD3KnHlG0XnivOJuJ764Zjt7SmM',
  秉任: 'https://lh3.googleusercontent.com/d/1IrCnyHwEFsU4q5haUtjG5_F0Fo8Pr3nm',
  夢恩: 'https://lh3.googleusercontent.com/d/1666wYImRgmyA4NayQV6HsGqCzUbXuVcL',
  翰倫: 'https://lh3.googleusercontent.com/d/1J2_r5bBFtGDhD2oh6Wz5IBf4RU113R6o',
  山本少尉: 'https://lh3.googleusercontent.com/d/1Prq2HCsgg2AaNVlVR9SuRlQFLiC9kPPV',
  
  // Scenes / Special
  掃描器: 'https://lh3.googleusercontent.com/d/1PNIlFiOG-SUgbu0P13UYwLPrIaYYHnPS',
  掃描餅乾: 'https://lh3.googleusercontent.com/d/1bYLVN_626bGinlW18Qz3G3kPZQQTRt_E',
  禾火草: 'https://lh3.googleusercontent.com/d/1CEvY5LvWcHvNZKNQFAtDd2RK1p7Q77Bx',
  學餐背景: 'https://lh3.googleusercontent.com/d/1zpdslu24fUDzCx_ybLWXtbV2rlehIm9l',
  廚師鐵鍋: 'https://lh3.googleusercontent.com/d/1I0e1HdSpJPUlzjwbRmJJ8Lj4mTJ5OZG3',
  過關途中: 'https://lh3.googleusercontent.com/d/19uoR1q5zoIChbSDqcpg1c_fQTPRwlkVz',
  初見山本: 'https://lh3.googleusercontent.com/d/188D87IIC5_fK2ahCIs2dw_4Snx3BhDAY',
  戰勝山本: 'https://lh3.googleusercontent.com/d/1voyn1SJfIfhSkQYHzbPDo4rsOf_8mE5s',
  彰中_學生遊蕩: 'https://lh3.googleusercontent.com/d/1uwgduEYi-D9m-f2QZdFZP66nPK1U9ekI',
  彰中_校長迎接: 'https://lh3.googleusercontent.com/d/1D4231SBNT48NGroBOJFTglzCLcMnjplX',
  彰中_校長給劍: 'https://lh3.googleusercontent.com/d/1Pxt4wYSb0nmtuDV0FWGpzHuQRcYIsfB6',
  趕路: 'https://lh3.googleusercontent.com/d/1sNrzACBNCK3MQtnPmO-tJYiOfbN2Z318',
  日軍遊魂飛散: 'https://lh3.googleusercontent.com/d/1z6MmDb0b6kp68s15S_IgmrOJa-Q7v_Yv',
  華陽市場: 'https://lh3.googleusercontent.com/d/16vi2yD9qo7ttoyCIpDUI1Lyr2FFLccqb',
  婆媽打架: '/huayang_fight.png',
  議會背景: 'https://lh3.googleusercontent.com/d/1eqBQiglxkXRtUoRdLSfN2qgGluDq-lwU',
};

export const CHAR_COLOR: Record<string, string> = {
  '秉任': '#60a5fa', // blue-400
  '翰倫': '#fb923c', // orange-450
  '夢恩': '#f472b6', // pink-400
  '安婷': '#34d399', // emerald-400
  '老闆': '#f59e0b', // amber-500
  '柯少獅': '#f59e0b', // amber-500
  '村下中佐': '#ea580c', // orange-600
  '村下速志': '#ea580c', // orange-600
  '店長': '#a1a1aa', // zinc-400
  '姜鳳興': '#fbbf24', // amber-400
  '木島': '#a78bfa', // purple-400
};

export interface WeaponDetail {
  atk: number;
  icon: string;
}

export const CHAR_IMG: Record<string, string> = {
  '安婷': IMG.安婷,
  '秉任': IMG.秉任,
  '夢恩': IMG.夢恩,
  '翰倫': IMG.翰倫,
  '山本少尉': IMG.山本少尉,
  '方水玉': 'https://lh3.googleusercontent.com/d/1OSt56jxq9ypxEDyJF6F6C55B-9-7eSQJ',
};

export const WEAPONS_DATA: Record<string, WeaponDetail> = {
  '木棍': { atk: 1500, icon: '🪵' },
  '鐵鍋': { atk: 2100, icon: '🍳' },
  '儀仗劍': { atk: 1200, icon: '🗡️' },
  '生鏽武士刀': { atk: 2500, icon: '⚔️' },
  '雲紫骨扇': { atk: 3500, icon: '🪭' },
  '蒼影丸': { atk: 4500, icon: '⚔️' },
  '青龍黃虎劍': { atk: 5500, icon: '🗡️' },
};

export const GAME_STAGES: DialogueStep[][] = [
  // ---- STAGE 0: 師大校區 ----
  [
    {
      type: 'narration',
      text: '時值1895年，清廷與日本簽訂馬關條約，把台灣和澎湖割讓給日本，引起台人強烈不滿和憤恨，在日本接收台灣之途，在各地伏擊日軍，阻撓日本佔領台灣，是為乙未戰爭，其中台人死傷眾多，平民更是佔多數，造成眾多悲劇。'
    },
    {
      type: 'narration',
      text: '在日軍經過八卦山之時，爆發抗日最為猛烈的一次戰役，史稱八卦山之役，烈士們百般阻撓日軍進入彰化縣城，最終還是以失敗告終，無數英勇戰士犧牲於八卦山上，而日軍在此戰也損失慘重，眾多日軍之靈聚集於八卦山，漸漸附在進德校區的一棵參天大樹之上，因為有樹靈壓制，百年來竟也相安無事。'
    },
    {
      type: 'narration',
      text: '在2026年的某日，大樹因為興建新校舍而被迫砍伐，遭到連根拔起，鎮壓下的日軍遊魂飛散而出，滾滾瘴氣逐漸往四處散逸，讓人畜死傷慘重，還讓通訊斷聯，眼見就要覆蓋整個彰化。'
    },
    {
      type: 'narration',
      text: '秉任、羅倫、夢恩、安婷四人是很要好的朋友，剛好一起去師大校區上通識課，這才免於一難，四人只有身體較為健壯的翰倫沒有被瘴氣震倒，趕快拉著其他三個好朋友起來。夢恩正要起身之時，突然「啊！」的一聲叫了出來，'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '怎麼了？'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '沒事......手掌突然碰到一個熱熱的東西，不知道是什麼......？'
    },
    {
      type: 'narration',
      text: '安婷盯著夢恩剛剛手壓著的地方，發現有一些奇特的橘紅色小草，在地上錯落有致，而且之前好像沒有，'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '是因為那些橘紅色的草嗎？以前好像沒在學校看過......？'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '真的耶！摸它會熱耶，好神奇喔！為什麼草會發熱啊？'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '植物理論上不該會出現這種情況，大概是被進德校區冒出的那股瘴氣影響的吧。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '你們看！這些草剛好長成一條線，好像在給我們指路一樣喔！'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '不然......我們沿著這個路線去看看吧，說不定......會有什麼新發現？'
    },
    {
      type: 'narration',
      text: '於是好奇的四人便跟著這種奇異的橘紅色小草前進著......'
    },
    {
      type: 'narration',
      text: '跟著橘紅色的小草，四人走到了一間實驗室裡面，裡面的桌上放了一台如收音機般的大小的機器，雖然感覺年代久遠，但是放在很醒目的地方，讓人一眼就能看到了，但是大家都沒看過那個機器。夢恩好奇的拿起來看看，打開電源，發現它還能用。'
    },
    {
      type: 'scan',
item: '邪氣探測機',
      img: IMG.掃描器,
      result: '探測機：邪気と物質探知機\n\n大正五年 台灣總督府中央研究所與台灣神社製造。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '哇！沒想到看起來破破的，竟然還能用耶！'
    },
    {
      type: 'narration',
      text: '翰倫湊過去看，發現在機器的背面寫著『邪気と物質探知機  大正五年  台湾総督府中央研究所と台湾神社  製』（邪氣與物質探測機  大正五年  台灣總督府中央研究所與台灣神社製造）。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '啊？！大正五年？感覺很久了耶，是......西元幾年啊......？'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '大正紀年剛好跟民國一樣，所以大正五年也就是民國五年，也是西元1916年。'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '西元1916年？為什麼是這一年製作出來的？還有......這個機器已經經過了一百多年，竟然還沒壞？！'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '我聽我阿祖説過，日本人做的東西都挺堅固的，而且他們那個時候的東西都不太容易壞！哎呀......不管了，重要的是這台機器能做什麼？'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '邪氣探測機......？能夠偵測到邪氣......也就是這種瘴氣吧，但是為什麼在一百年前的台灣就有這種東西出現......？莫非是這種瘴氣在1916年就已經爆發過，所以才會有這台機器的誕生......？！'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '既然那時候就爆發過，那為什麼台灣都沒有什麼事，我們也還能在這裡？'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '也許是爆發的形式不同，我記得1916年在台中南投一帶好像有兩次大地震，可能跟這有關？'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '好啦，不管啦，你們都不會肚子餓嗎？上了兩節課，現在都中午了，該吃飯了吧......'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '你們看！講桌上有一包餅乾，我們拿來吃吧！'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '那是別人的東西吧，怎麼隨便拿來吃啊.....而且也不知道放了多久了......'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '那個......說不定可以用這台探測機來掃描看看？畢竟現在發生這種異變，空氣裡或多或少都有一點瘴氣的污染，如果吃下肚就不好了......'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '好啊，那我來掃描看看！'
    },
    {
      type: 'scan',
      item: '掃描餅乾',
      img: IMG.掃描餅乾,
      result: '⚫「不可食用」「遭污染」⚫\n\n警告：在機器掃描之下，螢幕顯示它的本體竟是一坨泥巴！'
    },
    {
      type: 'narration',
      text: '於是夢恩拿著探測機跑去講桌前，掃描這包餅乾，只見機器冒出警告，警示燈冒著黑色的光，顯示著「不可食用」「遭污染」等字樣，而在機器掃描之下，螢幕顯示它的本體竟是一坨泥巴！'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '嗚哇！這是什麼鬼東西啊！'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '民間流傳『魔神仔』會幻化泥土、蚯蚓、牛糞、青蛙、昆蟲等不可食用的東西給人吃，讓人看到的是一頓佳餚，現在這種瘴氣應該也有相似的影響。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '呼！幸好我沒吃......那麼還是去學餐好好吃一頓吧！'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '我們還是拿個東西來防身吧，如果遇到奇怪的東西可以應變。'
    },
    {
      type: 'additem',
      item: '木棍'
    },
    {
      type: 'narration',
      text: '四人慢慢向外移動，天空的顏色紫黑紫黑的，比剛才更深一點了，於是趕快前往學餐找找一些吃的……（顯示道具列多了木棍）'
    },
    {
      type: 'narration',
      text: '前往學餐的路上，一樣也有橘紅色的小草指引著道路，夢恩不禁拿起機器掃描一下，看看這種小草到底是什麼。（顯示掃描鍵）'
    },
    {
      type: 'scan',
      item: '禾火草',
      img: IMG.禾火草,
      result: '🌿 禾火草 (和火草)\n\n在八卦山附近特別多，帶在身旁好像能夠抵擋瘴氣，還可以讓精神體力稍微變好一點，只是裝太多背包會熱熱的。\n\n【探測燈分級功能】\n🟢 綠燈：非常理想健康食用品。\n🟡 黃燈：稍微差一點的食物。\n🔴 紅燈：極度不健康的垃圾食物。\n⚫ 黑燈：不可食用或已遭污染。\n\n利用探測機，可以掃描任何東西，呈現其應有的價值和本質。'
    },
    {
      type: 'narration',
      text: '螢幕上顯示這種草叫做「禾火草」，在八卦山附近特別多，帶在身旁好像能夠抵擋瘴氣，還可以讓精神體力稍微變好一點，只是裝太多背包會熱熱的，翰倫拿了一株禾火草放進背包。夢恩到處拿著探測機來掃描，發現它可以掃描任何東西，呈現出各種東西原本應有的價值和本質，還會依據東西可不可食用、健康程度來分類：綠燈是很理想的食物；黃燈是稍微差一點的食物；紅燈是很不健康的食物；黑燈則是不可食用、或遭污染的東西。'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'setscene',
      scene: 'canteen'
    },
    {
      type: 'narration',
      text: '四人一路來到了學餐，裡面只有一些學生，跟以前的景象大不相像，角落還有坐了一些受傷的人，現場瀰漫著不安、恐懼和絕望的氣氛。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '哎......每次到學餐就是人滿為患，如今反而只剩小貓兩三隻，我以前不太喜歡那麼吵雜、那麼煙火氣的地方，現在反而有點想念了......'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '（暗自心想：如果這場異變再這樣下去，很多人可能以後再也沒辦法再看到了......）'
    },
    {
      type: 'narration',
      text: '但是為了趕快抵達進德校區，四人還是隨便點了一道菜充飢'
    },
    {
      type: 'food',
      location: '寶山校區'
    },
    {
      type: 'setscene',
      scene: 'cook'
    },
    {
      type: 'narration',
      text: '吃了食物之後，四人感覺身體好多了，更有力量可以抵抗瘴氣，肚子也不餓了，聽到他們要去進德校區，裡面的廚師拿了個全新的大鐵鍋給翰倫當作稱手的武器。'
    },
    {
      type: 'dialogue',
      speaker: '廚師',
      text: '雖然很難以啟齒，但是拜託你們一定要把那些學生救出來啊！我的姪子也在那邊，也有很多常常來吃飯的老面孔，實在不忍心讓他們就這樣被異變給弄死！'
    },
    {
      type: 'additem',
      item: '鐵鍋'
    },
    {
      type: 'narration',
      text: '手上的鐵鍋有點沉，周圍的同學眼神深邃且熾熱，他們眼框邊緣的淚水被悲憤的怒火燒乾，翰倫接過鐵鍋，難得的不發一語，安婷點個頭向廚師致意，四人整裝待發，繼續向前進。'
    },
    {
      type: 'stageclear',
      stage: 0
    }
  ],

  // ---- STAGE 1: 忠靈祠 ----
  [
    {
      type: 'setscene',
      scene: 'transit'
    },
    {
      type: 'narration',
      text: '四人朝著八卦山軍人忠靈祠古道連夜趕路。四周越來越安靜，甚至聽不到一聲鳥啼或蟲鳴。山道兩旁的樹木全被染成了暗紫色，詭異至極。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '總覺得周圍的空氣越來越冷，連吐氣都有白煙了……這不合常理啊。'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '大家，看前方……那兩條斑駁的古石柱，那就是「忠靈祠」的大門入口！'
    },
    {
      type: 'setscene',
      scene: 'shrine'
    },
    {
      type: 'narration',
      text: '一踏入殿前廣場，四周的氣氛瞬間大變。大殿的牌坊上盤旋著黑紫色的濃重瘴氣，令人窒息。在那滾滾怨魂浪潮中，一個身披古舊大正時期軍裝、手按日本軍刀的日軍少尉幽靈半飄在空中，發出淒厲的狂笑。'
    },
    {
      type: 'dialogue',
      speaker: '山本少尉',
      text: '八嘎！何人膽敢驚擾本皇軍近衛師團……山本少尉之長眠！'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '山本少尉！你已被超渡超昇百年，卻在此刻重返人間散播不祥瘴氣，危害四方！'
    },
    {
      type: 'dialogue',
      speaker: '山本少尉',
      text: '笑話！乙未年吾等喋血於此八卦山麓，這百年怨念、百年暴怒，豈是幾句超渡便能平息！今日這片山頭，都將臣服在皇軍怨靈之下！'
    },
    {
      type: 'narration',
      text: '面對來勢洶洶的幽魔少尉，四位夥伴將意志力與精力提升到頂峰，手持廚師送的鐵鍋與木棍，深吸一口氣，大喝一聲迎上前去戰鬥！'
    },
    {
      type: 'combat',
      enemy: '山本少尉',
      hp: 3,
      enemyImg: IMG.山本少尉
    },
    {
      type: 'setscene',
      scene: 'shrine_plain'
    },
    {
      type: 'narration',
      text: '戰鬥過後，迷霧漸漸散去，日本軍營的假象慢慢退去，恢復至原本的忠靈祠景象。山本少尉用軍刀插在地上，撐著身體喘著氣。'
    },
    {
      type: 'dialogue',
      speaker: '山本少尉',
      text: '可惡，你們這群馬鹿野郎⋯⋯為什麼還要阻止皇軍大業⋯⋯好不容易實現大東亞共榮圈的第一步了，卻被幾個小鬼頭阻撓......悔しい (真不甘心)......'
    },
    {
      type: 'dialogue',
      speaker: '山本少尉',
      text: '台灣的大膽暴民，你們要幹嘛......！'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '你們看！周圍好像有很多軍人叔叔伯伯的靈魂一擁上！'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '這就是罪不可赦的下場，不管是死於日軍刀下的亡魂，還是英勇為國的國軍英魂，都想把惡毒的殖民者趕出台灣。'
    },
    {
      type: 'dialogue',
      speaker: '山本少尉',
      text: '呃啊！區區次等國民......也敢造次，可惡啊，許されない(不可饒恕)！'
    },
    {
      type: 'narration',
      text: '他軍刀揮舞幾下，重心不穩，無力的撲倒在地上，只能任由一批又一批，年代不同、年齡不同，卻有著相同理念的台灣英靈擊打，最後在痛苦的喊叫中化為齏粉。'
    },
    {
      type: 'narration',
      text: '翰倫揮手向那些英靈們道謝，眾人用手向大殿拜了拜，發現裡面的桌子有一些食物，打完一場硬仗的眾人決定吃點東西。'
    },
    {
      type: 'food',
      location: '忠靈祠'
    },
    {
      type: 'narration',
      text: '吃完食物的眾人又恢復了些體力，走出正殿，'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '那邊有幾把生鏽的武士刀，可以拿來用用。'
    },
    {
      type: 'narration',
      text: '眾人前去拾起武士刀，繼續往進德方向前進。（顯示道具列多了生鏽武士刀）'
    },
    {
      type: 'additem',
      item: '生鏽武士刀 ⚔️'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'stageclear',
      stage: 1
    }
  ],

  // ---- STAGE 2: 彰化高中 ----
  [
    {
      type: 'setscene',
      scene: 'ch_wandering'
    },
    {
      type: 'narration',
      text: '眾人接著往山下走，經過彰化高中時，裡面的學生很多已經因為異變而回家了，只剩一些人還留在學校，有些人在學校遊蕩徘徊、徬徨著，不知道自己還有沒有明天；有些人在暴飲暴食，對於此異變最為消極悲觀；有些人則趁機作惡，到處打人惹是生非，或是偷嚐禁果，在『死』的面臨前，把『生』的慾望盡數發洩。四人繞過那些被純粹的慾望支配的學生，夢恩用著鄙視的眼神看著他們。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '難以理解......'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '別看了，每個人都是獨立的個體，有自己的意志，我們雖然沒辦法理解，但也無法干涉，快步走過去就是了。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '別管他們了......不知道為什麼，我肚子又餓了，不是才剛吃完嗎......？'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '我也有點餓了……可能是這個瘴氣會讓人消耗異常大量的能量，我們一定要隨時注意補充體力，才不會走到一半就倒下了。'
    },
    {
      type: 'setscene',
      scene: 'ch_welcoming'
    },
    {
      type: 'narration',
      text: '到了活動中心門前，發現有一群師生聚集在此，議論紛紛，甚是吵雜，一看到四人靠近，眾人的目光都聚集在四人身上，眼神變成銳利起來。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '什麼啊……怎麼大家都這樣看我們…..？'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '喂！你們什麼意思？我們是要去進德校區解決異變的，幹嘛對我們這麼有敵意？'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '（帶頭的瘦高男學生高興的對四人說）你們就是秉任、翰倫、夢恩、安婷四人？（接著轉向旁邊的中年男子說）校長，我猜的果然沒錯！'
    },
    {
      type: 'dialogue',
      speaker: '校長',
      text: '四位同學辛苦了，我已經幫各位在裡面準備好食物讓各位接風洗塵了，剛剛有什麼失禮的就請各位多多包涵了，在這種情況下，他們都精神緊繃，對於不認識的人自然有敵意的，抱歉了，大家進來休息一下吧。'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '（鞠躬致謝）'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '校長多謝，我們大家都是一樣的，突遭異變，大家都是手足無措的，比較激動一點是很正常的，校長也讓大家進去休息吃東西吧。'
    },
    {
      type: 'narration',
      text: '於是眾人魚貫進入活動中心，準備吃東西。'
    },
    {
      type: 'food',
      location: '彰化高中'
    },
    {
      type: 'setscene',
      scene: 'ch_sword'
    },
    {
      type: 'narration',
      text: '眾人風捲殘雲地把食物掃清一空後，體力終於恢復，四人和彰中的大家寒暄幾句又要啟程。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '校長、大家，我們不能太多耽誤時間，現在也該走了。'
    },
    {
      type: 'narration',
      text: '校長和善的表情霎時僵了一下，隨即恢復笑容。'
    },
    {
      type: 'dialogue',
      speaker: '校長',
      text: '對！你們救人要緊，就不耽誤大英雄了，趕快趕路吧。對了，我們這裡有幾隻儀仗劍，順便也帶著吧，可以應付沿途的不測。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '校長，這儀仗劍應該......'
    },
    {
      type: 'narration',
      text: '話都尚未說完，就被秉任搖頭示意不要再說。'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '感謝校長的好意，那我們就收下校長的好意了，告辭。'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '（微微欠身，四人拿著行李繼續啟程。）'
    },
    {
      type: 'additem',
      item: '儀仗劍 🗡️'
    },
    {
      type: 'setscene',
      scene: 'ch_walking'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'narration',
      text: '在路上，夢恩嘟著嘴抱怨起來。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '剛剛為什麼不讓我說啊，這明明連開刃都沒有，根本沒有戰鬥力嘛！'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '妳沒看那個校長當我們要走時有露出一絲不同的表情，好似在說我們走太快了，而且那股皮笑肉不笑的微笑也讓人看了不舒服。'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '對，我剛剛也有偷偷用掃描器照校長，結果是黑燈，代表......校長可能已經被瘴氣影響了，或是被鬼魅附身了，總之不能再多逗留。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '呼......幸好沒有再多吃一點，説不定就被鬼附身了......'
    },
    {
      type: 'narration',
      text: '於是四人懷著不安又焦急的心情繼續趕路。'
    },
    {
      type: 'stageclear',
      stage: 2
    }
  ],

  // ---- STAGE 3: 華陽市場 ----
  [
    {
      type: 'setscene',
      scene: 'huayang_market'
    },
    {
      type: 'narration',
      text: '四人又繼續趕路，到了華陽市場，裡面有一些搶肉搶菜搶食物的人。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '哇！傳統市場竟然還有冷氣，地上也有鋪瓷磚！只是現在有點亂就是了⋯⋯'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '正好趕路到一個可以休息的地方，趕快吃東西，休息一下吧，接著還要啟程的。'
    },
    {
      type: 'food',
      location: '華陽市場'
    },
    {
      type: 'setscene',
      scene: 'huayang_fight'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1pwR6mnTWSZwv4jTNLAZ1CFZXdVM5vL96'
    },
    {
      type: 'narration',
      text: '在比較安全的角落吃完食物後，四人艱難地互相推擠著，穿過打成一團的婆婆媽媽們，繼續往進德校區前進。'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'stageclear',
      stage: 3
    }
  ],

  // ---- STAGE 4: 彰化縣議會 ----
  [
    {
      type: 'setscene',
      scene: 'council'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1eqBQiglxkXRtUoRdLSfN2qgGluDq-lwU'
    },
    {
      type: 'narration',
      text: '又走了一段路，四人到了彰化縣議會，這裡也是人去樓空，外牆斑駁，完全沒有以前的氣派，夢恩拿起探測器掃描一下，發現這裡的瘴氣密度特別高，黑燈警示一直響個不停，翰倫提議進去看一下。'
    },
    {
      type: 'scan',
      item: '初入彰化縣議會',
      img: 'https://lh3.googleusercontent.com/d/1eqBQiglxkXRtUoRdLSfN2qgGluDq-lwU',
      result: '⚫「高濃度瘴氣警告」「黑燈警示」\n\n警告：此處的瘴氣密度異常之高！黑燈指示劇烈閃爍！古舊斑駁的議會大門之後，似乎正盤旋著一股生人勿近的幽怨力量。'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '進去嗎......？也行吧，那大家要務必小心。'
    },
    {
      type: 'narration',
      text: '四人於是進入早已壞掉的大門。'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/12AWHWTf4zmDohtNMub-oKLG4zEGH_ysf'
    },
    {
      type: 'narration',
      text: '進來館內以後，裡面瀰漫著一種令人生畏的威壓感，讓人喘不過氣，但是空氣意外的清澈透亮，同時中夾雜了一種奇妙的淡香。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '好奇妙的香味喔，雖然沒有很濃，但是還滿香的......'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '這是......松蟲草（紫盆花）的花香，有一種淡淡的甜香味，我之前在阿嬤家有聞過......只是......在台灣不多見，這裡為什麼有這種香味？明明瘴氣很重，門口花盆內的花都死光了，還有這種味道？'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '進去一探究竟就知道了！'
    },
    {
      type: 'narration',
      text: '於是四人走過走廊到了一樓中心的議會廳。'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1OSt56jxq9ypxEDyJF6F6C55B-9-7eSQJ'
    },
    {
      type: 'narration',
      text: '越接近議會廳，那股花香就越濃，四人繞過樓梯進入議會廳，議會廳中央赫然站著一個身高約莫五尺五寸（170公分），穿著古裝華服、形銷骨立、穿金飾銀、頭上別株松蟲草、不知是男是女、渾身散發不祥之氣，他聽到四人的腳步聲，轉身過來面對四人，他持扇遮面、只露半邊樣貌，但可看出容貌不俗、且面容傅粉施朱，加上華服之襯托，顯然是名門望族之後。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '這又是什麼時代的人啊？我們是在演穿越劇嗎？'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '甚是無理！吾名乃方水玉，字崑川，是彰化一帶的名門望族，進德封印解除後，吾魂才得以重回此處。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '啊，原來是男的啊......'
    },
    {
      type: 'narration',
      text: '方水玉環顧闖將來的四人，原本冰冷傲慢的眼神，在掃過最前方的秉任時突然微微一縮，眉骨蹙了蹙，那雙塗抹了厚重硃砂的眼底登時閃過壹絲哀怨，表情也緩和、溫柔了數分。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '這裡的大門不是隨時都敞開的，諸位能到此處也算是一種緣分，不如......來者是客，先緩步一下，坐下聊聊？'
    },
    {
      type: 'narration',
      text: '秉任愣了一下，思考半晌。'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '那就恭敬不如從命了，先在此休息一下吧。'
    },
    {
      type: 'narration',
      text: '方水玉揮袖一撫，精緻木折扇在空中畫出一道幽香紫圈。頃刻間，大廳前方的桌案上竟然憑空幻化擺放出了各式香撲鼻、令人垂涎欲滴的精美佳餚和熱呼呼餐飲，四人看的垂涎三尺，食指大動，於是先吃為敬。'
    },
    {
      type: 'food',
      location: '彰化縣議會'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/16zULdQ0B16UoPs5Q5dldPkGcnrzPtrgR'
    },
    {
      type: 'narration',
      text: '在四人吃喝之時，坐在雕花主位上的方水玉一邊摩挲著精緻的茶盞，一邊幽幽地向眾人敘述起了他埋藏在彰化百年之久的哀怨故事......'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '閑著也是閑著，不如說說吾的故事吧......'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '小生在大正七年，也就是1918年生，生於臺中州彰化市，家族是彰化赫赫有名的彰化方家，幫日本人做賣鹽生意，可謂富甲一方，有一位青梅竹馬哥哥，也是彰化望族，名爲楊鴞恩，字勤閔，在大正五年生，我都叫他勤閔兄，楊家是幫日本人做製糖生意。我們從小便認識，情同莫逆、互知底細、知心相交、感情深篤無比。哥哥他英俊瀟灑、斯文儒雅、面如冠玉而身材挺拔，更難得是聰穎絕頂、光明磊落、為人厚道、絕不做下流苟且之事。我常常往楊家跑，在二樓勤閔兄的房間大開話匣，每每必是滿載而歸。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '後來我們都去台北讀書，我讀台北第一師範學校，勤閔兄大我兩歲，更為爭氣，去讀台北帝大工學部的機械工學科，我們兩人在台北互相扶持，一起借住在楊家親戚在台北的房子，兩人在同個屋簷下共度數年的時光，同床共寢......'
    },
    {
      type: 'narration',
      text: '說到此處，方水玉的嘴角有些上揚，但是隨之色變，嘆了一口氣。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '雖然我們畢業後在台北都有找到穩定的工作，但是好景不長，在太平洋戰爭爆發後，在昭和19年，也就是西元1944年，勤閔兄思想被日本軍國思想所蠱惑、執意投筆從戎，我深知一去可能不返，時時規勸兄長不要做傻事，夜夜垂淚、苦苦相勸，怎知哥哥剛毅好強、志意頑固如鐵石！在臨走前的那夜，我還記得那是星期天，是一個極其氣悶的星期天，農曆四月二十八......呵，還是個討厭的閏四月，外頭下著淅淅瀝瀝暴躁不休的梅雨，房內空氣微溫，濕氣滯空，歡愉過後的我們汗流浹背的躺在床上，我起身倒水給哥哥喝，忍不住又多叨念幾句，起初只是一次再平凡不過的勸說，怎知最後演變成在房間裡激烈爭吵，勤閔兄一氣之下奪門而出，披上大衣覆雨而去。'
    },
    {
      type: 'narration',
      text: '方水玉說到激動處抓住秉任的手，微微一顫。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '我那晚哭了一整夜，想說等勤閔兄氣消後就返回來了，怎料這場梅雨直直下，最後看到的只有漫無邊際的烏雲和勤閔兄的堅決血書，我南下彰化老家，求父親聯絡軍中認識的有力人士相助，依然石沈大海，結果直到隔年，在台北大轟炸過後，在楊家的門口看到楊家人收到軍中送來的信，我因為與勤閔兄同居，被楊家人所不待見，等到楊家人散了之後，我衝上去拉住小妹雨繆，只有雨繆對我還不錯，她眼框紅腫，淚早已乾，只餘兩行淚痕，她雙手顫抖的把勤閔兄的遺書交給我，她說這份是特別寫給我的，我眼前一黑，差點昏死過去，幸好雨繆趕緊扶著我，我緩緩打開書信，工整的鋼筆字躺在信上，文字還是帶有勤閔兄一貫的風格。'
    },
    {
      type: 'narration',
      text: '說到激動處，方水玉抓著秉任的手縮得更緊、更用力了些，秉任嚇得愣了一愣，還是繼續聽他說下去。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '以下就是書信內容了：崑川弟台鑒  尺素僅奉汝手，是夜實兄之過，不該不辭而別，怎奈共枕易落口舌，實是屢屢遭人閒言，兄知汝我兄弟二人親情不斷如金，而今兄長即將而立卻無能報國，只能隻身投入日幟，軍旅實苦，不堪多忍，不過幾月，幾近感似闊別數秋，從前富家華奢、諸多銀金，全無用處，雖有護家之心，卻無效國之體，實乃慚愧，太平洋諸役皇軍皆失利，兄現身居呂宋，雖無即時之憂，但可窺其陷落之時，自知時日不多，故起身奮筆，倒也聊據閒暇枯乏時刻，兄知弟與家父已多年不和，此信恐無法為弟所啟，所幸小妹與汝交情甚篤，可由她轉交於汝，此時轟雷聲又起，機翼懸空不斷，又將啟程，之後諸事勿念，望安好。  兄  勤閔謹啟'
    },
    {
      type: 'narration',
      text: '方水玉讀完已是全身劇烈顫慄、胸口劇烈起伏、淚流滿面、泣不成聲、喉嚨裡只能發出乾渴嘶啞的悲鳴。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '好啦，我知道你很想念他啦，但是人死終究是無法挽回的，不如放下過去吧......好嗎？'
    },
    {
      type: 'narration',
      text: '安婷本來要阻止夢恩說完的，但來不及了，只能讓夢恩說出來，方水玉聽後臉色大變，面色鐵青。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '什麼「放下」？！汝以為我在乎的是生死別離之苦嗎？汝等豎子當真充耳不聞嗎！我與勤閔兄感情篤厚，從總角之時至弱冠之後，不下二十年，耳鬢廝磨、情投意合，我對勤閔兄這二十年如一日，同室而居、雲雨繾綣、情愛糾葛。可他居然只敢寫是『親情不斷』，怎是親情？怎是友情？亦或是『無能報國』或是『易落口舌』能夠解釋的？一聲未説，不辭而別，卻在臨死前寫下這種答覆！一言半語溫暖皆無！怎叫人咽的下氣？吾後來又被兩家家長一齊説教痛罵一番，氣不過，於是跑上閣樓，未留遺書，懸梁與世長辭。只為去冥界向他問個明白！'
    },
    {
      type: 'narration',
      text: '方水玉面容歪曲，指關節如枯木鐵枝般縮緊，死死鉗著秉任的手腕，一邊將病態化妝的臉緊密貼上秉任。甚至伸出另外一隻手，霸道而極近偏執地摟上了秉任僵直的腰背，雙目如蛛網般噴湧出狂熱而崩潰的赤芒。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '秉任......你可以理解吧，你瞧著多俊，這眉眼、這貌清冷出塵，和我的勤閔哥哥也有幾分相像！如同清風臨樹、朗月幽泉，這定是哥哥的轉世，一定是！汝......一定也是深深愛慕著我的，對不對？快答應我，把你的身心靈都奉獻與我、生生世世與我融為一體吧！'
    },
    {
      type: 'narration',
      text: '秉任睜大眼睛，下意識的後退一些。'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '抱歉，這......恐怕不太好......'
    },
    {
      type: 'narration',
      text: '方水玉沒有退縮，反而變本加厲地將身體壓上去，面色飛紅。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '莫慌......當初我也是過了幾天才能夠接納兄長，兄長也甚是雄壯，但之後就是舒坦日子了，凡事起頭難，不如把身子委於我如何......？'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '對不起，我對你沒有意思，況且你的行為我很不舒服，我們在這也待很久了，不如先行一步，告辭了！'
    },
    {
      type: 'narration',
      text: '四人正要離開議會廳，方水玉閉眼仰天，雙手捧面，雙眼噙淚。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '哈哈哈哈！是嗎......！百年前他欺我，百年後汝等人世也視我如蛇蠍妖孽、連汝也要當場拒絕、踩踏我卑微不屈的心意嗎？！我的絕望、我的熾熱、我的愛之深切，孰人能曉？！既然我得不到，那索性就拉你們所有人一同墜入阿鼻地獄，萬劫不復吧！'
    },
    {
      type: 'combat',
      enemy: '方水玉',
      hp: 5,
      enemyImg: 'https://lh3.googleusercontent.com/d/1OSt56jxq9ypxEDyJF6F6C55B-9-7eSQJ'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1p4oonJAmMJdZ5eLY6Qu5fspAYa_Uh9id'
    },
    {
      type: 'narration',
      text: '方水玉體力不支，癱倒在地，臉上花妝被浸濕，身上也早已血跡斑斑。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '呵呵呵......武士刀......到頭來，我還是死在了日本鬼子的武器上......也罷，汝也夠相似了，也算被勤閔兄斬了，抵了這齣情債......斬吧！把我的思念與魂魄一刀二斷！'
    },
    {
      type: 'narration',
      text: '秉任有些遲疑，雙手舉起卻遲遲不敢揮下。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '斬又不斬，退又不退，卻是何故！再無話說，汝速速動手！'
    },
    {
      type: 'narration',
      text: '秉任神情複雜，閉眼揮出最後一刀，劈穿方水玉的身體，方水玉漸漸體力消散，意識模糊。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '年輕人，好好睜眼看這世界，世人不公、道理不明，此次爆發我也算略知一二，實是幕後有人操弄......積怨已久，必當返還，因果輪迴，亦復如是......汝名物理？'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '秉任......'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '秉任嗎......好名字，永秉初心，已任道遠......你知道勤閔兄的名字也大有來頭呢......取自詩經『豳風．鴟鴞』：鴟鴞鴟鴞、既取我子、無毀我室。恩斯勤斯、鬻子之閔斯。'
    },
    {
      type: 'narration',
      text: '方水玉乾枯且無力的手輕輕撫上秉任的臉，不抱任何惡意，只帶著純粹的憐憫和愛意。'
    },
    {
      type: 'dialogue',
      speaker: '方水玉',
      text: '俊後生......吾好生羨慕現代之人，比起當時自由許多，但同時也徒增一些暴戾之氣......這就是非大同世界之罪......遺憾不能瞧見爾等成功之時了，就讓這把雲紫骨扇當作吾的餞別禮吧......'
    },
    {
      type: 'additem',
      item: '雲紫骨扇'
    },
    {
      type: 'narration',
      text: '語畢，方水玉的軀體緩緩消散，化作鱗粉消散在空氣中，只留下一把淡雅的紫色扇子，和久留不散的淡淡的松蟲草香氣。'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1lEScVwZIBRiEXRj0Tl44npblH2oHG19w'
    },
    {
      type: 'narration',
      text: '四人打完一場激戰，又在心靈上也遭受震撼，坐在地上歇息，秉任若有所思；翰倫拿起扇子，發現它是一個武器；夢恩和安婷還在討論著方水玉的身世和遭遇。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '我覺得他雖然有點偏激，但是......還算不壞？只是個......被玩弄感情的小男生？'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '這樣說也是可以，我突然想到，松蟲草的花語是『追憶』和『思念』，也許還挺貼切的……'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '我也有聽過不同的說法，是『寡婦的悲哀』和『不能實現的愛情』，這也許也可以解釋……但是無論如何，逝者已逝，現在他也只能任由後人評論了。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '你們看！我發現這把扇子是一種武器！嘿！這樣一揮……是不是很厲害？！'
    },
    {
      type: 'narration',
      text: '翰倫大力一揮，扇子造成的氣流互相交織干擾，形成猶如爪子的風壓，破空而去，把議會廳前排的椅子都削壞了。夢恩大喜。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '真棒！那麼我們就拿這把扇子當作之後的武器吧！抱歉了，願你安息，在九泉下得到應得的對待⋯⋯謝謝你給的扇子。'
    },
    {
      type: 'narration',
      text: '四人整理一下心情，踏步離開彰化縣議會，繼續前行。'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'stageclear',
      stage: 4
    }
  ],
  // ---- STAGE 5: 中山國小 ----
  [
    {
      type: 'setscene',
      scene: 'zhongshan_ele'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/15vKVM3ycMfQljkAoFyU8Vzje0qpjmr3j'
    },
    {
      type: 'narration',
      text: '四人繼續前行，越靠近進德校區，瘴氣污染更嚴重，到了中山國小，國小生都被家長接回家了，只剩空蕩蕩的校園，秉任四人從小門進去，幾乎每間教室都鎖著，地面蒙著一層厚厚的灰塵，好像已經廢校已久一樣，只有少數幾間教室還可以進入，翰倫推開一扇門，發現裡面還有食物，於是眾人開始大快朵頤起來。'
    },
    {
      type: 'food',
      location: '中山國小'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1tDYCETqOWuiLlXZ9VoAtWukw822-N6Ks'
    },
    {
      type: 'narration',
      text: '補充完體力後，四人繼續啟程，前往下一個目的地，但是當四人走出校門後，在四人的後面，校門的暗處，四人沒看到的角落，躲著一個暗影……'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'stageclear',
      stage: 5
    }
  ],
  // ---- STAGE 6: 海鮮店 ----
  [
    {
      type: 'setscene',
      scene: 'seafood_supermarket'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1VbLnuwarvD09a8emisDhaIDuidmlsoOW'
    },
    {
      type: 'narration',
      text: '前往進德校區的途中，夢恩看到路邊有一個賣烤魚、魚湯的海產店，看得眼睛都直了，'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '「哇！有烤魚耶⋯⋯之前我怎麼都沒看到這家店啊！走走走，大家一起進去吃東西！」'
    },
    {
      type: 'narration',
      text: '她拉著安婷就要進去，其他兩人也只好跟著進去。進去之後，櫃檯的店員看到四人進來，露出笑容，熱情的迎接他們，他是一個壯年男子，雙手刺青、留個刺頭短髮、身材高大魁梧、肌肉結實，一看就是個練家子，'
    },
    {
      type: 'dialogue',
      speaker: '老闆',
      text: '「嘿！彰師的厚！來來來，我是老闆啦，要吃什麼？直接看菜單跟我說就好！」'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '「好啊！那我們就來點餐吧！你們看一下自己要吃什麼！」'
    },
    {
      type: 'food',
      location: '海鮮店'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1p2ryC7G33XeuL6scJ3LZ1yehYXGZuOic'
    },
    {
      type: 'narration',
      text: '四人大快朵頤之時，一邊和老闆聊天，'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '「老闆，你烤的魚好好吃喔！」'
    },
    {
      type: 'narration',
      text: '秉任看著老闆放在桌上的名片寫著他的名字：『柯少獅』，總覺得在哪裡見過，但又一時想不起來。安婷喝了一口湯，驚艷於它的鮮美之餘，也注意到了這裡的空氣異常清新，比在彰化縣議會那時面對方水玉時的空氣還清澈，也沒有那種壓迫感，就好像原來發生異變之前的空氣一樣。四人吃完後，準備付錢離開，老闆柯少獅看到夢恩背包里的禾火草，動作凝固了一下，收了錢後想了想，拍拍翰倫的肩膀，'
    },
    {
      type: 'dialogue',
      speaker: '柯少獅',
      text: '「台灣的命運就交給你們了。」'
    },
    {
      type: 'narration',
      text: '四人向老闆道謝後繼續啟程，往進德方向前進。'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'stageclear',
      stage: 6
    }
  ],
  // ---- STAGE 7: 中山豆漿 ----
  [
    {
      type: 'setscene',
      scene: 'zhongshan_soy'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1PfYllmL7QsJ5yqmauY6NCFq0G48oZA94'
    },
    {
      type: 'narration',
      text: '越來越接近進德校區，瘴氣的污染越來越嚴重，空氣裡瀰漫了不祥的紫色煙霧，四人只能強忍著不適努力前行，到了路旁的中山豆漿，本來想要好好吃一頓，卻聽到有叫罵聲從店鋪內傳出，四人湊近一看，竟是一個日本軍官在罵老闆。那個軍官中等身高、略有福態、腰間繫了一把精緻軍刀、一套軍裝衣冠整潔、但是面容兇惡，渾身散發出瘴氣，一看就是死而復生的日軍魂魄，他也注意到四人的接近，轉頭過來，怒目圓睜，'
    },
    {
      type: 'dialogue',
      speaker: '村下速志',
      text: '「這幾個小鬼是誰？怎麼感覺很討人厭的樣子？難道就是木島先生說到的那幾個小毛頭？哼，我可是大日本帝國的中佐，名爲村下速志，低賤的台灣人，也想挑戰我的權威？」'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '「誰是木島先生？」'
    },
    {
      type: 'dialogue',
      speaker: '老闆',
      text: '「你這傢伙不講理啊！吃了東西不付錢，還說我家的東西難吃，怎麼可以有這麼惡毒的人啊！」'
    },
    {
      type: 'narration',
      text: '村下中佐瞪了老闆一眼，不耐煩地把他推開，拍拍身上的軍裝，拔出腰間的武士刀，刀身亮晃晃的，凜亮如一泓清泉，'
    },
    {
      type: 'dialogue',
      speaker: '村下速志',
      text: '「愚蠢，能提供食物給我可就是無上的光榮了，還想讓我付錢，難道還不知足嗎？次等公民們？吃吃我的愛刀『蒼影丸』的力量吧！」'
    },
    {
      type: 'narration',
      text: '夢恩聞言怒不可遏，揮動著武器上前戰鬥，其他三人也趕緊跟上。'
    },
    {
      type: 'combat',
      enemy: '村下速志',
      hp: 7,
      enemyImg: 'https://lh3.googleusercontent.com/d/1PfYllmL7QsJ5yqmauY6NCFq0G48oZA94'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1xo5n2b7ciSGJqgHfJVYggu9wM90TPqRE'
    },
    {
      type: 'narration',
      text: '好不容易戰勝村下中佐，四人都已經精疲力竭，倒在地上的村下中佐眼睛充滿血絲，'
    },
    {
      type: 'dialogue',
      speaker: '村下中佐',
      text: '「畜生（ちくしょう）（可惡啊）......卑劣的外鄉人......明明勝利就在眼前了......但是你們也無法阻擋木島先生的計劃了，哈哈哈哈哈......」'
    },
    {
      type: 'narration',
      text: '安婷還沒來得及問木島是誰，村下中佐就斷氣了，身軀慢慢崩解，只留下他的佩刀，翰倫拿起那把武士刀，沈甸甸的，刀身出鞘，反射的光芒白亮冷豔，是一把殺人利器，秉任接過武士刀，將它收好。此時在後門躲避的店長緩緩走出，'
    },
    {
      type: 'dialogue',
      speaker: '店長',
      text: '「都好了嗎？那我去煮點東西給各位吃......」'
    },
    {
      type: 'additem',
      item: '蒼影丸'
    },
    {
      type: 'food',
      location: '中山豆'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1Zfe-qcOV-xvysY_fqjCUL0vzUrz2h4ZZ'
    },
    {
      type: 'narration',
      text: '四人邊吃著美味佳餚，邊平復心情，有一句沒一句的聊著，'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '「妳也有聽到村下說的『木島先生』吧，他到底是誰？」'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '「我有聽到......但是我也想不透那是誰，難道這個日本人就是方水玉說的幕後黑手？」'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '「我也不確定，唯一能確定的是要趕快抵達進德校區，才能阻止他們的陰謀。」'
    },
    {
      type: 'narration',
      text: '四人吃飽喝足後又馬不停蹄往進德方向趕路。'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'stageclear',
      stage: 7
    }
  ],
  // ---- STAGE 8: 喜美超市 ----
  [
    {
      type: 'setscene',
      scene: 'seafood_supermarket'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1X5oouDFcouNGq96_ukwrRsGChQtTovfH'
    },
    {
      type: 'narration',
      text: '四人終於來到了進德校區前面的喜美超市，進學校前，四人還是先在喜美超市買一些東西來吃，補給體力。進門之後，不知道是因為冷氣或是何種緣故，外面濃濃的瘴氣壓迫感又消失了，只剩下新鮮清爽的空氣，逛了一會，結帳時，店員是一個老伯伯，秉任看到店員的名牌叫『姜鳳興』，又是一陣熟悉感，但是也想不起來在哪裡見過這個名字，四人結帳後，店員拉過來桌椅，就在店裡面直接吃東西。'
    },
    {
      type: 'food',
      location: '喜美超市'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1-n7DFT1T2r5YyV6HzNF3GHSPgzFeXo86'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '「你們看......那個伯伯的背肌練得好好喔......！」'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '「不要盯著人家亂看。」'
    },
    {
      type: 'narration',
      text: '吃完食物後，店員伯伯拿著一箱木箱過來，'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '「伯伯你不用給我們什麼東西啦，我們也差不多要繼續趕路了！」'
    },
    {
      type: 'narration',
      text: '店員姜伯伯彷彿置若罔聞，繼續把他的木箱打開，裡面有一把寶劍，'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '「伯伯，這是......？」'
    },
    {
      type: 'dialogue',
      speaker: '姜鳳興',
      text: '「年輕人，這把寶劍就送你們了，我一個老頭也用不上了。」'
    },
    {
      type: 'dialogue',
      speaker: '姜鳳興',
      text: '「這把叫做『青龍黃虎劍』，劍鞘正面為一條青龍，背面則是一隻大黃虎，劍身輕盈、極為鋒利、削鐵如泥、正氣凜凜，相信各位會把它用在正確的道路上的。」'
    },
    {
      type: 'additem',
      item: '青龍黃虎劍'
    },
    {
      type: 'narration',
      text: '言畢，拂袖而去，瀟灑離席。四人也暗暗下了決心，一定要把源頭根除，繼續踏上前行之路。'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1yO3TWc4ej0qi_ZRkDjWnFlr0xJAxL0Ue'
    },
    {
      type: 'narration',
      text: '四人離去後，姜鳳興到了後方倉庫，環顧四周，'
    },
    {
      type: 'dialogue',
      speaker: '姜鳳興',
      text: '「出來吧，躲躲藏藏的，還算是個男子漢嗎？」'
    },
    {
      type: 'narration',
      text: '良久，一個身著儒服的古風小生，卻佩戴著武士刀，緩緩從冰櫃產生的霧氣中走出，'
    },
    {
      type: 'dialogue',
      speaker: '木島',
      text: '「別急，姜老先生，好戲還在後頭呢，不是嗎？而且......你都把寶劍給那群學生了，還有跟我對抗的餘地嗎？」'
    },
    {
      type: 'narration',
      text: '姜鳳興啐了一口，'
    },
    {
      type: 'dialogue',
      speaker: '姜鳳興',
      text: '「哼，木島，你個小癟三，為皇軍效力就這麼光榮嗎？老子不用刀劍也可以把你這個邪魔歪道滅了！」'
    },
    {
      type: 'narration',
      text: '隨即抓起拖把，急奔過去，欺近木島身旁，朝木島的肚子用力的捅下去，'
    },
    {
      type: 'dialogue',
      speaker: '姜鳳興',
      text: '「誰說沒有刀刃就捅不死人的！？」'
    },
    {
      type: 'narration',
      text: '木島不慌不忙，看準了姜鳳興出招的瞬間，以毫釐之差避開身軀，讓拖把棍子擦身而過，只在衣服上劃破了一個口子；而姜鳳興便不同了，全力灌注的後果是只注意到攻擊，而忘卻了木島的反擊，結果就是被木島拔出的脇差一記大袈裟砍中鎖骨，當場倒地，木島冷冷看著地上血流不止的姜鳳興，'
    },
    {
      type: 'dialogue',
      speaker: '木島',
      text: '「技不如人呢，老將軍，乖乖回去三途川吧，不要妄想擊潰我們的計劃。」'
    },
    {
      type: 'dialogue',
      speaker: '姜鳳興',
      text: '「可惡的傢伙......我就算死了......也要看到你被......他們擊敗！」'
    },
    {
      type: 'dialogue',
      speaker: '木島',
      text: '「是嗎？那就期待看看吧。」'
    },
    {
      type: 'grass_event'
    },
    {
      type: 'stageclear',
      stage: 8
    }
  ],
  // ---- STAGE 9: 進德校區（終章） ----
  [
    {
      type: 'setscene',
      scene: 'jinde'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1zpdslu24fUDzCx_ybLWXtbV2rlehIm9l'
    },
    {
      type: 'narration',
      text: '四人終於到了進德校區，踏入大門，學校樓牆傾圮，儼然廢墟，與去日相差甚遠，而天色暗沉，紫黑之雲密佈，空氣中瀰漫著足以讓人窒息的瘴氣份量，更是顯示了此地危機重重。'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '「瘴氣發源地……我們終於抵達了…….」'
    },
    {
      type: 'narration',
      text: '四人趕快趕去學餐那裡，搶食僅存的一點口糧。'
    },
    {
      type: 'food',
      location: '進德校區'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/15qWndWc6bpZdq0YOWde1v9X32LhBQpYp'
    },
    {
      type: 'narration',
      text: '四人終於填飽肚子，慢慢走進校園中心，靠近那顆被砍倒的樹，那棵樹雖然被砍倒，但是周遭散發出驚人的瘴氣，四人驚訝之餘，危機已經悄悄來臨，旁邊一根粗大的殘木突然斷裂，往他們方向倒下，夢恩及時揮出那把雲紫骨扇，才讓樹木碎裂崩解，不讓四人受傷，在樹木崩解之後大量的灰燼瀰漫而出，四人望著樹木的殘根，一陣煙霧瀰漫之後，一個身影從灰燼中緩緩現身，待到灰塵散盡之時，大家也是看清了他的面貌，是一名中年男子身著西裝，微微駝背，微笑的看著四人，秉任看清楚來者之後，大驚失色，'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '「你......你不就是彰中的顏校長嗎？！為何會出現在這裡？」'
    },
    {
      type: 'dialogue',
      speaker: '顏校長',
      text: '「四位可真是彰化乃至於全台灣的英雄啊......不知道來到終點站的感想如何？」'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '「難怪我一直感覺到一股視線......原來就是你在跟蹤嗎？你的目的到底是什麼？想阻止我們，讓台灣陷入一片荒蕪嗎？！」'
    },
    {
      type: 'dialogue',
      speaker: '顏校長',
      text: '「喔，不對不對，我可是很愛台灣的，這方土地養我育我，怎麼可能做出出格的事？這只是我們小小計劃的一環罷了。」'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '「你這就是出格了！説！這起異變到底是不是你引發的！」'
    },
    {
      type: 'dialogue',
      speaker: '顏校長',
      text: '「要怪就怪你們校長太單純吧......我只是略施小計，他就乖乖的幫我把那棵百年老樹砍掉，省得我再費心，還真是貼心啊。」'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '「你的目的到底是什麼！」'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1Ws8v8nUxF2BaU-gff2PH5rYAQoN-KM8P'
    },
    {
      type: 'narration',
      text: '還沒等到顏校長回答，一支箭矢破空穿雲而來，勢如奔雷，來勢洶洶，但是卻被顏校長輕易抓住，緊跟箭後的是一個粗獷的漢子，四人定睛一看，原來是海鮮店的老闆柯少獅，他跨著流星大步飛奔而來，'
    },
    {
      type: 'dialogue',
      speaker: '柯少獅',
      text: '「木島！！還不速速受死！！！」'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '「木島？難道就是村上中佐説的『木島先生』？他就是顏校長？」'
    },
    {
      type: 'dialogue',
      speaker: '柯少獅',
      text: '「什麼鹽不鹽，糖不糖的我不知道，他就是這場異變的元兇——木島田律！我跟他本來不是同一個時代的人，因為我在抗日之時就已身亡，但是在921大爆發時，那時我們第一次照面，才知道這人的底細。他是日軍很倚賴的將領，同時也是足智多謀的軍師，在東南亞戰場和太平洋戰場積極的表現，侵略很多地方，為日軍立了大功，後來被美軍圍困於呂宋，被美國將軍抓起來，好像被當作男寵，之後......」'
    },
    {
      type: 'narration',
      text: '柯少獅尚未說完，就被木島散發出的殺氣強制打斷了，他現在已經變身成那時與姜鳳興交手的衣著，即是身著儒服，佩戴著武士刀的古風小生，'
    },
    {
      type: 'dialogue',
      speaker: '木島',
      text: '「説完你的遺言了嗎......呵，不對，你已經死過一次了......而且就算是你，也只有了解到我的冰山一角罷了，你又能知道我的多少？」'
    },
    {
      type: 'narration',
      text: '『少』字語音剛落，木島已經奔至柯少獅面門前，一記居合拔刀揮出，被瞠目豎眉的柯少獅用雙斧擋下，'
    },
    {
      type: 'dialogue',
      speaker: '柯少獅',
      text: '「姦爾娘！給我再去一次地獄吧！」'
    },
    {
      type: 'narration',
      text: '兩人迅速見招拆招，一時打得難分難解，電光石火間，已過了十幾回合，只見刀光斧影，鏗鏘之聲不絕於耳，四人都看呆了，'
    },
    {
      type: 'dialogue',
      speaker: '秉任',
      text: '「我們趁現在趕快去找到那顆樹吧，這樣才能解決根源！」'
    },
    {
      type: 'narration',
      text: '但是當四人準備開溜之時，柯少獅也慢慢居於下風，漸漸抵擋不了木島的凌厲攻勢，雙手持斧動作逐漸凌亂起來，身上的刀傷也越來越多，'
    },
    {
      type: 'dialogue',
      speaker: '柯少獅',
      text: '「哼，縱使要賠上這條賤命，我也不會讓你越一步雷池的！你這個四腳仔！」'
    },
    {
      type: 'narration',
      text: '木島露出一個微妙的笑容，眼珠子轉了一圈，'
    },
    {
      type: 'dialogue',
      speaker: '木島',
      text: '「嗯......？四腳仔嗎......？這可不對呦，我可是正港的台灣人啊......」'
    },
    {
      type: 'narration',
      text: '柯少獅愣了一下，手沒拿穩斧頭，被木島攻破防線，一隻手臂被俐落的斬斷，錐心之痛傳遍身體各處，他勉強用意志力撐著，不至跪地，但是還是痛苦地哀嚎，'
    },
    {
      type: 'dialogue',
      speaker: '柯少獅',
      text: '「啊......你這個可惡的傢伙！竟然是三腳仔......明明是台灣人，為何還為虎作倀......！」'
    },
    {
      type: 'narration',
      text: '木島冷眼看著柯少獅，武士刀戳進他的右肺，還攪弄了一下，'
    },
    {
      type: 'dialogue',
      speaker: '木島',
      text: '「愚昧，能效忠皇軍是多麼無上的光榮，你們這群暴民當然是不會理解的......竟敢還癡心妄想要阻止皇軍大業？」'
    },
    {
      type: 'dialogue',
      speaker: '柯少獅',
      text: '「可惡......都已經過了多久了，為何還在執著於復興大日本帝國......？這群臭狗有這麼直得被侍奉嗎......！？」'
    },
    {
      type: 'narration',
      text: '木島沒有回應柯少獅，直接一刀斬下他的首級，夢恩看到不禁尖叫起來。'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1kbeNqp98r8GWPNmuTSRGvxFMwCknUOqN'
    },
    {
      type: 'narration',
      text: '木島不看柯少獅的屍體一眼，徑直走向四人，武士刀上鮮血緩緩滴落在地，秉任和翰倫挺身而出，分別拔出蒼影丸和青龍黃虎劍，想要與之抗衡。但是安婷又站到二人面前，質問木島，'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '「等一下，剛剛你和柯將軍的對話，我可不能當作沒聽到，你身為台灣人，爲何要幫日本人？過了這麼久，爲何還是如此執著？你的真面目到底是誰？顏校長、木島田律，到底哪個才是真正的你？」'
    },
    {
      type: 'narration',
      text: '木島愣了一會，仰天笑了幾聲，'
    },
    {
      type: 'dialogue',
      speaker: '木島',
      text: '「哈哈哈哈......不錯，真不錯......有膽識的女孩，讓我告訴你吧......你們應該也跟他交手過了，你再看看你旁邊的男的，應該叫做秉任吧，仔細端詳我們的臉吧......」'
    },
    {
      type: 'narration',
      text: '安婷對照了一下秉任和木島的臉，看了半晌，倏地了解了，她面色鐵青的看著木島，'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '「不會吧......難道你就是......」'
    },
    {
      type: 'dialogue',
      speaker: '木島',
      text: '「哈哈哈！聰明的女孩！沒錯，小生就是楊鴞恩，字勤閔，大日本帝國陸軍第十四軍第四十八師團大佐，木島田律，也是在一個月前奪舍了彰化高中的顏校長。」'
    },
    {
      type: 'narration',
      text: '四人聽到大受震撼，不敢相信眼前的千面人就是楊鴞恩，方水玉的伴侶。'
    },
    {
      type: 'dialogue',
      speaker: '夢恩',
      text: '「不可置信......你這個負心漢竟然還有種出現在我們眼前，不對，你那時為什麼沒有去幫方水玉一起抵抗我們？」'
    },
    {
      type: 'dialogue',
      speaker: '楊鴞恩',
      text: '「哼，我可沒義務去救那個廢物，我們早就在82年前的那個夏夜恩斷義絕了，而且我也受不了他的死纏爛打和情緒轟炸，他只是我的一個玩物罷了。」'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '「喂！台奸！說這麼多，為何還是跟人家一起同居，甚至還把兩家關係搞成如此不好？」'
    },
    {
      type: 'narration',
      text: '楊鴞恩一時語塞，臉上一陣青一陣白，頭上直冒青筋，惱怒的他又衝上來要去對付四人，忽然天搖地動，讓五人都站不穩，地上也出現一道道的縫隙，'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1VjcMxJJsRZZCMQEj2PJyAEk6uT7sKR27'
    },
    {
      type: 'dialogue',
      speaker: '翰倫',
      text: '「哇哇哇，這又是搞哪齣啊！」'
    },
    {
      type: 'dialogue',
      speaker: '安婷',
      text: '「你們看！那裡好像出現了什麼！」'
    },
    {
      type: 'narration',
      text: '其他三人和楊鴞恩一齊往那裡看去，只見房屋傾倒，牆垣磚瓦散落一地，從樹根下鑽出一大胖鬼，身高250有餘，體重150不只，高大魁梧、體型肥碩、膀大腰圓、肥頭大耳、身膚黝黑、手持長矛、渾身散發著濃烈的瘴氣，上身不著半縷，只有下身一條破布褲，樣貌極其醜陋猥瑣，楊鴞恩看到他，眉頭緊蹙，'
    },
    {
      type: 'dialogue',
      speaker: '楊鴞恩',
      text: '「這是......？尤幹·達爾朵，外號『泰雅兆銘』......？我可沒預料到他會來......」'
    },
    {
      type: 'dialogue',
      speaker: '尤幹·達爾朵',
      text: '「喂！這不是我們木島大人嗎？怎麼來我這裡了？」'
    },
    {
      type: 'dialogue',
      speaker: '楊鴞恩',
      text: '「什麼你這裡？彰化可是我的老本營，明明計劃上沒有你的啊......？」'
    },
    {
      type: 'dialogue',
      speaker: '尤幹·達爾朵',
      text: '「是老蔡腳我來的！」'
    },
    {
      type: 'dialogue',
      speaker: '楊鴞恩',
      text: '「老蔡？應該是蔡堂祿吧？明明他正在跟正田討論事成之後的事項才對啊......？不管了，這裡由我來辦就足夠了。達爾朵，你先去台北保護石大人和蔡大人吧，這裡由我解決就好。」'
    },
    {
      type: 'narration',
      text: '楊鴞恩話才剛說完，達爾朵身體便開始抖動，嘴裡還在自言自語，好似進入癲狂狀態，楊鴞恩自覺不妙，'
    },
    {
      type: 'dialogue',
      speaker: '楊鴞恩',
      text: '「喂！尤幹·達爾朵！在幹嘛？還不服從指令！」'
    },
    {
      type: 'narration',
      text: '誰知達爾朵已經雙眼發紅，進入狂暴狀態，充耳不聞身旁事，只看有一個人對他頤指氣使，一個暴怒，把楊鴞恩抓起來往地上重重一摔，半截身子都被摔入土裡了，四人看到達爾朵如此瘋狂，開始拿起武器，準備最後的殊死決戰。'
    },
    {
      type: 'combat',
      enemy: '尤幹·達爾朵',
      hp: 9,
      enemyImg: 'https://lh3.googleusercontent.com/d/1VjcMxJJsRZZCMQEj2PJyAEk6uT7sKR27'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/12QuHEm8VQP_JJJNF8mC2yonzF92e-s6m'
    },
    {
      type: 'narration',
      text: '四人經過一番艱辛苦戰，終於戰勝達爾朵，達爾朵全身都是傷，體力不支，長矛也斷成兩截了，還多處傷口血流不止。他倒在那棵被砍到只剩樹根的殘樹上，然後身體開始吸收著空氣中的瘴氣，身軀越來越膨脹，尤其是肚子最為明顯，楊鴞恩不知道何時從土裡爬了起來，拍拍身上的泥土，無奈的看著達爾朵。'
    },
    {
      type: 'dialogue',
      speaker: '楊鴞恩',
      text: '「唉，一切都完了，我們的計劃都泡湯了......這些瘴氣接下來就只能被達爾朵慢慢吸收了，這個貪婪的傢伙......」'
    },
    {
      type: 'dialogue',
      speaker: '楊鴞恩',
      text: '「這傢伙好吃懶做，也不知是好是壞，老天讓他有如此奇葩的身軀，他的外號是『泰雅兆銘』，因為當初原住民族反抗日本時，就是日本的軍官將他策反，讓他率領族人背叛同族，落了個互相廝殺的悲劇，而他還因此沾沾自喜，以此來依傍權勢，讓他更是肆無忌憚，貪得無厭，最後在二戰期間的一次大轟炸，他被燃燒彈擊中，命喪黃泉。」'
    },
    {
      type: 'narration',
      text: '語畢，楊鴞恩走向達爾朵，想從他口中套出一些資訊，怎料達爾朵身體膨脹速度過快， 當楊鴞恩走到達爾朵身旁時，達爾朵的身軀應聲炸裂，發出強烈的爆鳴聲，同時也把楊鴞恩一併炸死了，兩人皆屍骨無存。眼見這些壞人皆已伏首，秉任、翰倫、夢恩、安婷四人也終於放下心中的巨擔，輕鬆許多，在進德校區內的倖存者，看到主謀已死，紛紛圍過來大喊：「大英雄！大英雄！」眾人望著慢慢放晴的天空，享受著被短暫忘卻的新鮮空氣，雖然家園破破爛爛，但是同心協力定能回復如初。'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1nHB9yxvWhX7iOKh2C1sXsTSPedqaQnS9'
    },
    {
      type: 'narration',
      text: '四人在寶山臨時校舍住下了，他們因為解決了這場異變，拯救了彰化乃至於台灣，所以四人皆上台領獎，他們臉上的笑容如此燦爛，後來他們四人成立『彰化紅霧異變對策委員會』，接續著他們的精神和意志，然後傳授那段不該被遺忘的歷史，但是更高興的是發自內心的善念和成就感。他們以後也許會回味這段奇幻的旅程，談論著山本少尉和村下中佐的無禮和倔強；回想起方水玉的怪奇與松蟲草香；暗自感謝英勇的魂魄柯少獅與姜鳳興；深思楊鴞恩的武藝和城府；抑或是尤幹·達爾朵的莽撞與肥滿，更有可能是......在途中看到、聽到的普通市民、學生們，他們的恐懼、反應行為、閃亮而堅定的眼神，就如同成功解決異變的四人一樣......。'
    },
    {
      type: 'cg',
      img: 'https://lh3.googleusercontent.com/d/1zqHVjH3qBp5TqECtbIPmtItFQW_Z1vMK'
    },
    {
      type: 'narration',
      text: '在不知某處的大樓裡，一名身穿西裝的年輕職員正急忙地快步往理事長室趕去。'
    },
    {
      type: 'dialogue',
      speaker: '職員',
      text: '「石理事長，這次又失敗了......」'
    },
    {
      type: 'narration',
      text: '理事長室各處物品都擺放的井井有條，在向北的那側牆面，掛了一幅旭日旗，石理事長年事已高、滿頭白髮、皺紋纏身、戴個眼鏡，雖然身體較為虛弱，但是心態卻比年輕小伙穩重許多；隨然有近視加上老花退化，但是眼鏡下的眼睛仍然和年輕時堅定有神，甚至更多了分深沈。'
    },
    {
      type: 'dialogue',
      speaker: '石正田',
      text: '「報告全部的情況吧。」'
    },
    {
      type: 'dialogue',
      speaker: '職員',
      text: '「報告理事長，我方成員山本太一郎少尉、方水玉、村下速志中佐、尤幹·達爾朵皆殞命，無一生還，瘴氣也還來不及擴散，就被失控的達爾朵吸收完了。」'
    },
    {
      type: 'dialogue',
      speaker: '石正田',
      text: '「明明有天時地利人和，還有木島前輩相助，爲何還會失敗！」'
    },
    {
      type: 'dialogue',
      speaker: '職員',
      text: '「報告理事長......木島大佐他......這次沒有成功逃離......被達爾朵一起炸死了......而......而且，這次還有陽界之生人來干擾。」'
    },
    {
      type: 'narration',
      text: '石理事長一驚，拐杖掉在地上，職員連忙幫忙撿起。'
    },
    {
      type: 'dialogue',
      speaker: '石正田',
      text: '「我石正田......枉活103歲......卻屢屢無法成就大業......如今連木島兄都無法好好照顧好......實在愧對上天......」'
    },
    {
      type: 'dialogue',
      speaker: '石正田',
      text: '「這次是誰在攪局？」'
    },
    {
      type: 'dialogue',
      speaker: '職員',
      text: '「是彰師大的學生。」'
    },
    {
      type: 'dialogue',
      speaker: '石正田',
      text: '「叫小蔡過來，我要跟他討論下次的計劃了。」'
    },
    {
      type: 'narration',
      text: '職員應聲後離開房間，又只剩石正田一人，他輕撫著茶杯，望著旭日旗。'
    },
    {
      type: 'dialogue',
      speaker: '石正田',
      text: '「始発点......距離現在也已經110年了呢......」'
    },
    {
      type: 'narration',
      text: '小職員走出房間後，在走廊剛好遇上蔡堂祿，他是一個中年男子，頭髮有些斑白，身穿正式西裝皮鞋，整齊筆挺，但是頭髮卻是出乎意料地亂，像個鳥巢一樣，小職員正要說話，蔡堂祿就打斷他。'
    },
    {
      type: 'dialogue',
      speaker: '蔡堂祿',
      text: '「我知道，理事長叫我吧？」'
    },
    {
      type: 'narration',
      text: '小職員點頭稱是，蔡堂祿嘴角上揚，右手提著一袋禾火草，左手拿著掃描器，自信昂首闊步前進，打開門。'
    },
    {
      type: 'dialogue',
      speaker: '蔡堂祿',
      text: '「理事長，聽說你有事找我？」'
    },
    {
      type: 'stageclear',
      stage: 9
    }
  ]
];

export const FOOD_DATA: Record<string, Food[]> = {
  '師大校區': [
    { 
      name: '蕎麥麵', 
      emoji: '🍜', 
      lamp: 'green', 
      desc: '精選蕎麥精緻製成，輕盈爽口，有益經絡順暢！',
      img: 'https://lh3.googleusercontent.com/d/1x4__vv7h0BMpX7L1EjGAQHznVjfzZJvx'
    },
    { 
      name: '糙米飯', 
      emoji: '🌾', 
      lamp: 'green', 
      desc: '天然原色糙米，含有足量膳食纖維與維生素，飽腹感十足！',
      img: 'https://lh3.googleusercontent.com/d/1J9prnRnZmQY-boMnP2FuC9fiYrsQ1Na7'
    },
    { 
      name: '水煮秋葵', 
      emoji: '🥦', 
      lamp: 'green', 
      desc: '天然鮮脆，清脆潤滑，保護腸胃黏膜的極佳綠色食材。',
      img: 'https://lh3.googleusercontent.com/d/1o2PYpU4tvYw2wZIriinlElfYb4zWkvUD'
    },
    { 
      name: '溫泉雞蛋粥', 
      emoji: '🥣', 
      lamp: 'green', 
      desc: '輕柔溫熱，易於吸收，補益被毒性瘴氣消耗的體力與精力。',
      img: 'https://lh3.googleusercontent.com/d/1CdSNttqCQYiXrwV7-MboVC36ei5rE7PZ'
    },
    { 
      name: '芭樂', 
      emoji: '🍐', 
      lamp: 'green', 
      desc: '富含高量維他命與膳食纖維，口感甜脆，是極佳的解渴鮮果。',
      img: 'https://lh3.googleusercontent.com/d/1VS__j5-fJcrQL6N7U3NPS0rM9dQvwbOT'
    },
    { 
      name: '豬里肌蛋吐司', 
      emoji: '🍞', 
      lamp: 'green', 
      desc: '厚實里肌肉片搭配煎蛋與柔軟土司，含有豐富的蛋白質與能量。',
      img: 'https://lh3.googleusercontent.com/d/1_FSH8mpSqUdEcI-jcc8WozMta1q764yb'
    },
  ],
  '寶山校區': [
    { 
      name: '蕎麥麵', 
      emoji: '🍜', 
      lamp: 'green', 
      desc: '精選蕎麥精緻製成，輕盈爽口，有益經絡順暢！',
      img: 'https://lh3.googleusercontent.com/d/1x4__vv7h0BMpX7L1EjGAQHznVjfzZJvx'
    },
    { 
      name: '糙米飯', 
      emoji: '🌾', 
      lamp: 'green', 
      desc: '天然原色糙米，含有足量膳食纖維與維生素，飽腹感十足！',
      img: 'https://lh3.googleusercontent.com/d/1J9prnRnZmQY-boMnP2FuC9fiYrsQ1Na7'
    },
    { 
      name: '水煮秋葵', 
      emoji: '🥦', 
      lamp: 'green', 
      desc: '天然鮮脆，清脆潤滑，保護腸胃黏膜的極佳綠色食材。',
      img: 'https://lh3.googleusercontent.com/d/1o2PYpU4tvYw2wZIriinlElfYb4zWkvUD'
    },
    { 
      name: '溫泉雞蛋粥', 
      emoji: '🥣', 
      lamp: 'green', 
      desc: '輕柔溫熱，易於吸收，補益被毒性瘴氣消耗的體力與精力。',
      img: 'https://lh3.googleusercontent.com/d/1CdSNttqCQYiXrwV7-MboVC36ei5rE7PZ'
    },
    { 
      name: '芭樂', 
      emoji: '🍐', 
      lamp: 'green', 
      desc: '富含高量維他命與膳食纖維，口感甜脆，是極佳的解渴鮮果。',
      img: 'https://lh3.googleusercontent.com/d/1VS__j5-fJcrQL6N7U3NPS0rM9dQvwbOT'
    },
    { 
      name: '豬里肌蛋吐司', 
      emoji: '🍞', 
      lamp: 'green', 
      desc: '厚實里肌肉片搭配煎蛋與柔軟土司，含有豐富 of 蛋白質與能量。',
      img: 'https://lh3.googleusercontent.com/d/1_FSH8mpSqUdEcI-jcc8WozMta1q764yb'
    },
  ],
  '忠靈祠': [
    {
      name: '供果',
      emoji: '🍎',
      lamp: 'hidden',
      desc: '供奉英靈的水果，只是拿一個應該不會怎樣吧⋯⋯？',
      scanResult: '🐛 麵包蟲\n\n水果內鑽出來一隻肥美的麵包蟲，掉在你手上，挑釁的扭動著。',
      realLamp: 'black',
      scanName: '麵包蟲',
      scanEmoji: '🐛',
      scanDesc: '水果內鑽出來一隻肥美的麵包蟲，掉在你手上，挑釁的扭動著。',
      img: 'https://lh3.googleusercontent.com/d/1wffPh4l2dZ-F92SVpKEjN-ElzOKADrSe'
    },
    { 
      name: '肉圓', 
      emoji: '🥟', 
      lamp: 'yellow', 
      desc: '一種圓形的食物，象徵著與心愛的家人團圓。味道香濃可口。',
      img: 'https://lh3.googleusercontent.com/d/1r5adG8BbejhI_BH5Fyg7uDEZZpih19b3'
    },
    { 
      name: '狀元糕', 
      emoji: '🧁', 
      lamp: 'yellow', 
      desc: '傳統米香狀元糕，米香撲鼻，蓬鬆細膩，寓意極好。',
      img: 'https://lh3.googleusercontent.com/d/15taR9XtSooO9Sm_W1MdHujeSRB46quIO'
    },
    { 
      name: '雞肉飯', 
      emoji: '🍛', 
      lamp: 'green', 
      desc: '香噴噴的鮮嫩雞絲淋上澄澈的雞油汁，無瘴氣污染，乾淨可口！',
      img: 'https://lh3.googleusercontent.com/d/1WTCY8bWuYmngmv6ju2TkmfW5wkGMJWar'
    },
    { 
      name: '麻糬', 
      emoji: '🍡', 
      lamp: 'yellow', 
      desc: '黏糯軟Q，飽滿的花生芝麻香，雖然稍微黏口但能迅速補給糖分。',
      img: 'https://lh3.googleusercontent.com/d/14pR4OKaD3IaGskw__ZNaNkUdWDIFzKr6'
    },
    { 
      name: '土魠魚羹麵', 
      emoji: '🍝', 
      lamp: 'yellow', 
      desc: '濃稠的传统土魠魚魚羹麵，湯底豐厚，口感稍微偏稠糯滞重。',
      img: 'https://lh3.googleusercontent.com/d/1Rk1B0Bv7S1UGgxnAEfKnHIA6Jd8bm0cl'
    },
  ],
  '彰化高中': [
    {
      name: '慶生蛋糕',
      emoji: '🎂',
      lamp: 'hidden',
      desc: '兩層蛋糕，上面有滿滿的奶油，還有巧克力點綴，看起來很好吃。',
      scanResult: '🧦 白色髒襪子\n\n蛋糕變成了一雙髒臭的白襪子，散發著讓人反胃的氣味，但是也許有人就好這口……？',
      realLamp: 'black',
      scanName: '白色髒襪子',
      scanEmoji: '🧦',
      scanDesc: '掃描過，蛋糕變成了一雙髒臭的白襪子，散發著讓人反胃的氣味。',
      img: 'https://lh3.googleusercontent.com/d/1jbXjRYYp26fzvPBeyAxMM7WJxLS_vSCS'
    },
    {
      name: '滷肉飯',
      emoji: '🍛',
      lamp: 'yellow',
      desc: '香氣撲鼻的滷肉肉燥鋪在熱熱的白米飯上。',
      img: 'https://lh3.googleusercontent.com/d/1RV7nv4AqjIriaTgcyW96h4fqKHgoSUFT'
    },
    {
      name: '金拱門',
      emoji: '🍔',
      lamp: 'red',
      desc: '高中生叫的外送，滿滿的速食，令人垂涎欲滴的炸雞薯條漢堡，飽足感十足的一餐。',
      img: 'https://lh3.googleusercontent.com/d/1IdHCXx9BjuYTEWJeUby3WKz4KLQiZqKD'
    },
    {
      name: '鮮肉飯糰',
      emoji: '🍙',
      lamp: 'green',
      desc: '新鮮現包的肉餡飯糰，營樣均衡，十分管飽。',
      img: 'https://lh3.googleusercontent.com/d/1tVFuYDrTyyb2lIug_ShSYXs_oDcG4dlm'
    },
    {
      name: '堅果',
      emoji: '🌰',
      lamp: 'green',
      desc: '天然富含健康油脂的不飽和脂肪堅果，有益思維敏銳度。',
      img: 'https://lh3.googleusercontent.com/d/1bkwoa5B2lgCZra4KPO-s8wnEDCfRL_3i'
    },
    {
      name: '洋芋片',
      emoji: '🥔',
      lamp: 'red',
      desc: '極其不健康的高鈉化學炸薯片。',
      img: 'https://lh3.googleusercontent.com/d/1ABPHOE5e7OUaPEbKVRxBrrEeFOlv9YPA'
    }
  ],
  '華陽市場': [
    {
      name: '清蒸泰國蝦',
      emoji: '🦐',
      lamp: 'green',
      desc: '活力滿滿的蝦子，今天剛送來市場，鮮美可口。',
      img: 'https://lh3.googleusercontent.com/d/13AybZ8JQ6N4n5VMLKkfitQosctmXndtH'
    },
    {
      name: '炸蝦咖哩飯',
      emoji: '🍛',
      lamp: 'red',
      desc: '黃澄澄的咖哩飯配上金黃酥脆的炸蝦，香味濃郁但稍嫌油膩。',
      img: 'https://lh3.googleusercontent.com/d/1YKLMkA7C8SE7cEAgbVE-bJhhHbpAmC_7'
    },
    {
      name: '岩漿外星人濃湯',
      emoji: '🥣',
      lamp: 'black',
      desc: '冒著綠色氣泡和詭異黏液的外星人濃湯，散發出不可名狀的驚悚氣息。',
      img: 'https://lh3.googleusercontent.com/d/1Qw-GKMY8YwteEmAXHrKK714DAI192FUu'
    },
    {
      name: '清炒鳳梨義大利麵',
      emoji: '🍝',
      lamp: 'green',
      desc: '清甜酸香、橄欖油清炒，無腸胃負擔的輕盈好麵。',
      img: 'https://lh3.googleusercontent.com/d/1gk9Mgn8d8_31ZTpQq1fFIht92ENp8Fe7'
    },
    {
      name: '炸蛋蔥油餅',
      emoji: '🥞',
      lamp: 'yellow',
      desc: '酥脆的外皮裹著半熟爆漿的炸蛋，香氣逼人，但油脂與鈉含量略高。',
      img: 'https://lh3.googleusercontent.com/d/1VPQpxIHO9qnYmCcRvH7hkI3GdYqoprH0'
    },
    {
      name: '三層肉',
      emoji: '🥩',
      lamp: 'red',
      desc: '油量滿滿、肥瘦相間的三層肉，多吃十分刺激腸胃。',
      img: 'https://lh3.googleusercontent.com/d/1Dz4thoqm8DPGlKAIDpM-W8KYy86vP2Sv'
    }
  ],
  '彰化縣議會': [
    {
      name: '乾煎鮭魚',
      emoji: '🐟',
      lamp: 'green',
      desc: '富含優質魚油，乾煎得恰到好處，香氣撲鼻且極佳健康。',
      img: 'https://lh3.googleusercontent.com/d/1xAIo5-Y-JgjT-W9bJOw3TqnfHiBFQBFL'
    },
    {
      name: '咖啡',
      emoji: '☕',
      lamp: 'hidden',
      desc: '每個辦公桌都有的，香味撲鼻，味道濃郁。',
      scanResult: '🧪 屍水\n\n散發出濃濃的腐爛味，喝下去感覺五臟六腑都要爛掉了，腐爛的可能早已不只是肉體，而是人心。',
      realLamp: 'black',
      scanName: '屍水',
      scanEmoji: '🧪',
      scanDesc: '散發出濃濃的腐爛味，喝下去感覺五臟六腑都要爛掉了，腐爛的可能早已不只是肉體，而是人心。',
      img: 'https://lh3.googleusercontent.com/d/1EBtMPPqOX5y5_6k3YRpkiNaN1O5lP_bZ'
    },
    {
      name: '蜂蜜奶油可麗餅',
      emoji: '🥞',
      lamp: 'red',
      desc: '甜美濃郁的可麗餅，淋滿了蜂蜜和厚厚的奶油，糖分過高。',
      img: 'https://lh3.googleusercontent.com/d/1jiiSAKQ0Gt6yUde5Ml7WLbWHJuoZYaPX'
    },
    {
      name: '茶葉蛋',
      emoji: '🥚',
      lamp: 'yellow',
      desc: '滷汁入味的經典茶葉蛋，能迅速補充優質蛋白質。',
      img: 'https://lh3.googleusercontent.com/d/1HExzD6TWQ5BvQq2e1KCFgAo85en2-vbt'
    },
    {
      name: '貓鼠麵',
      emoji: '🍜',
      lamp: 'yellow',
      desc: '彰化名產貓鼠麵，經典美味，湯頭鮮甜。',
      img: 'https://lh3.googleusercontent.com/d/1OdBruCTIkf0NWdsxRXmyD5n1MjRdOSUk'
    },
    {
      name: '爌肉飯',
      emoji: '🍛',
      lamp: 'yellow',
      desc: '香醇濃厚的经典爌肉飯，富含能量但稍微油膩。',
      img: 'https://lh3.googleusercontent.com/d/19PlNOkZrUnhAiFYzsKX2kgYYoq0B3Yt0'
    }
  ],
  '中山國小': [
    {
      name: '營養午餐',
      emoji: '🍱',
      lamp: 'green',
      desc: '標準的一碗白飯加上三菜一湯，有時候也有水果，雖然通常會出現一些莫名其妙的菜色。',
      img: 'https://lh3.googleusercontent.com/d/1M-wR3NEgJ6o9ucLZe66MD6ASfhE6wUBM'
    },
    {
      name: '蘋果麵包',
      emoji: '🍞',
      lamp: 'yellow',
      desc: '福利社會有賣的簡單零食，小朋友肚子餓時的救星。',
      img: 'https://lh3.googleusercontent.com/d/1FO9EuFsOxrPShm7sIJbIfhK5jU6JZ0Gf'
    },
    {
      name: '熱牛奶',
      emoji: '🥛',
      lamp: 'green',
      desc: '溫熱滑口，香濃營養，能溫養受創的心神體能。',
      img: 'https://lh3.googleusercontent.com/d/19I_-Mhj-1VtQYDgfeUjUaMrLu6ayTEyK'
    },
    {
      name: '紅燒非洲草原象',
      emoji: '🐘',
      lamp: 'black',
      desc: '不可思議的巨型紅燒象肉，散發出怪異劇毒的黑霧。',
      img: 'https://lh3.googleusercontent.com/d/1Vdd_DzrHWolb7AsqOHjCi082ZFeHB2uj'
    },
    {
      name: '鹹酥雞',
      emoji: '🍗',
      lamp: 'red',
      desc: '炸得酥脆惹人的鹹酥雞，香氣無比誘人但實質毒副反應高。',
      img: 'https://lh3.googleusercontent.com/d/1av5qoUonETmah4dFIGFnoaDVmOfptlsa'
    },
    {
      name: '珍珠奶茶',
      emoji: '🥤',
      lamp: 'red',
      desc: '超高糖分和高飽和脂肪的精製珍奶，增加消化負擔。',
      img: 'https://lh3.googleusercontent.com/d/1dptXNHDjsNJ9Dx7OGJ3gFxzD1DUe4Rc7'
    }
  ],
  '海鮮店': [
    {
      name: '鹽烤斑馬魚',
      emoji: '🐟',
      lamp: 'green',
      desc: '精裝鹽烤斑馬魚，色澤與調料搭配絕佳，食指大動。但評價為何偏低？',
      img: 'https://lh3.googleusercontent.com/d/1gXYkCM0nSksBOuFVKGDdgp4nFymuy-eh'
    },
    {
      name: '蒲燒大鯛魚',
      emoji: '🐟',
      lamp: 'yellow',
      desc: '色香味俱全的誘人蒲燒大雕魚餐點，但吃完好似肚子還是空泛。',
      img: 'https://lh3.googleusercontent.com/d/1aE3XWOV5a3UW9uPaor03QOylfhktu5or'
    },
    {
      name: '牛奶文蛤',
      emoji: '🐚',
      lamp: 'yellow',
      desc: '白香濃汁調煮的新鮮大文蛤，滑潤濃汁，飽含水分靈能。',
      img: 'https://lh3.googleusercontent.com/d/1kTpIuy82bYsYIePOCoPWQzOfIQw9IfDV'
    },
    {
      name: '三杯美人魚',
      emoji: '🧜',
      lamp: 'black',
      desc: '那種長頭髮身材極好、半人半魚的美人魚！三杯爆炒，美味中蘊藏厲毒。',
      img: 'https://lh3.googleusercontent.com/d/1g27Pc_yrBXCmJzlASRapbkgxajYbIGNq'
    },
    {
      name: '清燉蛤蜊湯',
      emoji: '🥣',
      lamp: 'green',
      desc: '湯頭鮮濃澄澈，蛤蜊飽滿，清熱降火極佳。',
      img: 'https://lh3.googleusercontent.com/d/13Er82ON6v8blKxACMNtCHbNG_p6bU8mg'
    },
    {
      name: '清淡海帶湯',
      emoji: '🥣',
      lamp: 'hidden',
      desc: '一碗看起來稀鬆平常、清可見底的海帶湯。',
      scanResult: '💇 美人魚的頭髮\n\n發現其實是美人魚的頭髮，難怪難以下嚥。',
      realLamp: 'black',
      scanName: '美人魚的頭髮',
      scanEmoji: '💇',
      scanDesc: '發現其實是美人魚的頭髮，難怪難以下嚥。',
      img: 'https://lh3.googleusercontent.com/d/1oLDu3yC4ij6c_zRBTZwlMEoX8CqdnwNn'
    }
  ],
  '中山豆': [
    {
      name: '清蒸霸王龍',
      emoji: '🦖',
      lamp: 'black',
      desc: '極致震撼的蒸霸王龍肉，透露重重史前死氣與瘴氣。',
      img: 'https://lh3.googleusercontent.com/d/1vKaWhKRDr5TxC1h8PuPY65-1VTc3mPl8'
    },
    {
      name: '無糖豆漿',
      emoji: '🥛',
      lamp: 'green',
      desc: '滑嫩醇厚，天然健康無添加，補充優質植物蛋白。',
      img: 'https://lh3.googleusercontent.com/d/1oqFtFKcIbUT8iiyvVq83tjTF3PjgEn_G'
    },
    {
      name: '蒸饅頭',
      emoji: '🍞',
      lamp: 'green',
      desc: '白白胖胖的健康蒸饅頭，麵香撲鼻，碳水飽滿暖胃。',
      img: 'https://lh3.googleusercontent.com/d/1DnBk36RY_wFBJikuSue4Fdfb48LtCCts'
    },
    {
      name: '全糖大米漿',
      emoji: '🥤',
      lamp: 'red',
      desc: '甜度極高、黏稠無比的大米漿，極其甜膩且增加腸道水分負擔。',
      img: 'https://lh3.googleusercontent.com/d/1-69NJweDy-o_LbYFhUD-IsouXTGLi2cj'
    },
    {
      name: '鐵板麵',
      emoji: '🍝',
      lamp: 'yellow',
      desc: '熱熱的夜市風味黑胡椒鐵板麵，口感厚實、鈉與油脂偏多。',
      img: 'https://lh3.googleusercontent.com/d/163jb2TodiXrxSUfc18tEnvrqb9owMX9g'
    },
    {
      name: '咔啦雞腿堡',
      emoji: '🍔',
      lamp: 'red',
      desc: '油炸酥脆的大塊咔啦雞腿肉夾在漢堡裏，十分高脂厚重。',
      img: 'https://lh3.googleusercontent.com/d/1LZAXmbDoGQ1T2d_fbwne2f24zhqHMgEy'
    }
  ],
  '喜美超市': [
    {
      name: '燕麥片',
      emoji: '🥣',
      lamp: 'green',
      desc: '純淨高纖的營養燕麥片，膳食纖維極其豐富，最自然的調合。',
      img: 'https://lh3.googleusercontent.com/d/1vv_6jkHsoyjbHRlLhhmoCr9ocWlqGneP'
    },
    {
      name: '肉鬆',
      emoji: '🥣',
      lamp: 'yellow',
      desc: '香鬆可口的傳統古法肉鬆，雖然美味但鈉含量不可小覷。',
      img: 'https://lh3.googleusercontent.com/d/1LGYM9ACJjXKTjCJgejgCgXYjawBGLvok'
    },
    {
      name: '無糖優格',
      emoji: '🥛',
      lamp: 'green',
      desc: '產自生機乳製的無糖輕盈優格，有益整腸排毒。',
      img: 'https://lh3.googleusercontent.com/d/1kXY6Hfu0iHrAMp5Cs70aMSP9_iSw6KkG'
    },
    {
      name: '生菜沙拉',
      emoji: '🥗',
      lamp: 'green',
      desc: '多種清脆時蔬沙拉，高水分、低污染、強效化解熱毒。',
      img: 'https://lh3.googleusercontent.com/d/1kU1ZK_3J7F1-bY1GBEwqUHtJudfcB4oq'
    },
    {
      name: '生啤酒',
      emoji: '🍺',
      lamp: 'yellow',
      desc: '冰涼爽快的金黃生啤酒，雖然暫時解憂消愁但實質略微降低思維感度。',
      img: 'https://lh3.googleusercontent.com/d/1TtjoO2KJsKOX0rGlRdTLrzUDfkgqjItb'
    },
    {
      name: '芒果',
      emoji: '🥭',
      lamp: 'yellow',
      desc: '香甜多汁的盛夏本土芒果，解渴聖品但糖分偏高。',
      img: 'https://lh3.googleusercontent.com/d/1xi54QbfPPQmw0SZSu3yHO5LSG3-f-Sb1'
    }
  ],
  '進德校區': [
    {
      name: '自助餐',
      emoji: '🍛',
      lamp: 'hidden',
      desc: '健康豐富的菜色，葷素皆宜，量大管飽。',
      scanResult: '🪲 甲蟲\n\n盤子上的飯菜都變成不可名狀的甲蟲，到處亂爬。',
      realLamp: 'black',
      scanName: '甲蟲',
      scanEmoji: '🪲',
      scanDesc: '盤子上的飯菜都變成不可名狀的甲蟲，到處亂爬。',
      img: 'https://lh3.googleusercontent.com/d/1AzTgE2B_fMA0mU5zm1R6b7N86yJ1RShz'
    },
    {
      name: '起司貝果',
      emoji: '🥯',
      lamp: 'yellow',
      desc: '香濃的起司包裹著柔韌美味的貝果，香味和能量雙重滿足。',
      img: 'https://lh3.googleusercontent.com/d/1Cwoi2AhG2hYYJSX9RyF96Hag0XQIGwA2'
    },
    {
      name: '時蔬芋頭米苔目',
      emoji: '🍜',
      lamp: 'green',
      desc: '經典鹹香美味，清淡好入口的中式老米苔目主食。',
      img: 'https://lh3.googleusercontent.com/d/161lpBLXg0cyawE_yBb_mzFYN11eOmxz7'
    },
    {
      name: '泡麵',
      emoji: '🍜',
      lamp: 'red',
      desc: '高鹽、重油的超加工方便麵食，雖然香氣誘人實則有害。',
      img: 'https://lh3.googleusercontent.com/d/1p-I13OVJEN8f5GghUoF7VwxgM31zvAma'
    },
    {
      name: '麻辣火鍋',
      emoji: '🍲',
      lamp: 'red',
      desc: '重辣重麻、油脂滿溢的麻辣火鍋，極度刺激胃腸黏膜。',
      img: 'https://lh3.googleusercontent.com/d/1rcEbsZ0nUuuJb7sXn7S82F8KspuPnQqR'
    },
    {
      name: '黃金蛋炒飯',
      emoji: '🍛',
      lamp: 'yellow',
      desc: '粒粒分明、蛋香撲鼻的黃金蛋炒飯，美味但用油量偏多。',
      img: 'https://lh3.googleusercontent.com/d/1OOQFoeT4BEGxkvyRjY5LGr7bceUwQmzw'
    }
  ]
};

export const LAMP_EFFECTS: Record<string, { energy: number; hp: number; text: string; theme: 'green' | 'orange' | 'red' }> = {
  green: { energy: 60, hp: 5, text: '🟢 綠燈食物：香甜乾淨！回復 60% 精力，增加 5 顆生命星印！', theme: 'green' },
  yellow: { energy: 30, hp: 3, text: '🟡 黃燈食物：味道一般。勉強回復 30% 精力，增加 3 顆生命星印。', theme: 'orange' },
  red: { energy: -30, hp: -4, text: '🔴 紅燈毒素：瘴氣入體！扣除 30% 精力，損失 4 顆生命星印！', theme: 'red' },
  black: { energy: -60, hp: -6, text: '⚫ 黑燈劇毒：魔神仔邪毒！扣除 60% 精力，損失 6 顆生命星印！', theme: 'red' },
};
export type LampType = 'green' | 'yellow' | 'red' | 'black';

// Dynamically resolve Google Drive images to high-speed local cached endpoints
function resolveImgUrl(url: string): string {
  if (typeof url !== 'string') return url;
  const match = url.match(/https:\/\/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `/images/${match[1]}.png`;
  }
  return url;
}

// Convert all top-level IMG properties
for (const key of Object.keys(IMG)) {
  (IMG as any)[key] = resolveImgUrl((IMG as any)[key]);
}

// Convert all of CHAR_IMG properties
for (const key of Object.keys(CHAR_IMG)) {
  (CHAR_IMG as any)[key] = resolveImgUrl((CHAR_IMG as any)[key]);
}

// Convert all food structures inside FOOD_DATA
for (const location of Object.keys(FOOD_DATA)) {
  for (const food of FOOD_DATA[location]) {
    if (food.img) {
      food.img = resolveImgUrl(food.img);
    }
  }
}

// Convert all image URLs inside GAME_STAGES
for (const stage of GAME_STAGES) {
  for (const step of stage) {
    if ((step as any).img) {
      (step as any).img = resolveImgUrl((step as any).img);
    }
    if ((step as any).enemyImg) {
      (step as any).enemyImg = resolveImgUrl((step as any).enemyImg);
    }
  }
}

