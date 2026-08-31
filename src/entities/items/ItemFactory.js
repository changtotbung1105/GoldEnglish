import { itemCatalog } from '../../data/itemCatalog.js';
import { GoldItem } from './GoldItem.js';
import { BombItem } from './BombItem.js';
import { WordItem } from './WordItem.js';

const constructors = {
  gold: GoldItem,
  bomb: BombItem,
  word: WordItem,
};

export class ItemFactory {
  static create(type, options = {}) {
    const config = itemCatalog[type];
    if (!config) {
      throw new Error(`Unknown item type: ${type}`);
    }

    const ItemClass = constructors[type];
    if (!ItemClass) {
      throw new Error(`No constructor registered for item type: ${type}`);
    }

    return new ItemClass(config, options);
  }
}
