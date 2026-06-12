/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GameState {
  hp: number;
  maxHp: number;
  energy: number;
  grass: number;
  inventory: string[];
  weapons: string[];
  firstCombatHit: boolean;
  lockedHearts: number;
}

export type SceneType = 'shida' | 'canteen' | 'cook' | 'transit' | 'shrine' | 'shrine_plain' | 'ch_walking' | 'ch_wandering' | 'ch_welcoming' | 'ch_sword' | 'huayang_market' | 'huayang_fight' | 'council' | 'zhongshan_ele' | 'seafood_supermarket' | 'zhongshan_soy' | 'jinde';

export interface Food {
  name: string;
  emoji: string;
  lamp: 'green' | 'yellow' | 'red' | 'black' | 'hidden';
  desc: string;
  scanResult?: string;
  realLamp?: 'green' | 'yellow' | 'red' | 'black';
  img?: string;
  scanName?: string;
  scanEmoji?: string;
  scanDesc?: string;
}

export type DialogueStep =
  | { type: 'narration'; text: string; char?: string }
  | { type: 'dialogue'; speaker: string; text: string }
  | { type: 'setscene'; scene: SceneType }
  | { type: 'cg'; img: string }
  | { type: 'scan'; item: string; img?: string; result: string; isHazardous?: boolean }
  | { type: 'food'; location: string }
  | { type: 'grass_event' }
  | { type: 'additem'; item: string }
  | { type: 'combat'; enemy: string; hp: number; enemyImg?: string }
  | { type: 'stageclear'; stage: number };
