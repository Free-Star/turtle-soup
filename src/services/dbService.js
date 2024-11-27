import { openDB } from 'idb'

const DB_NAME = 'turtle_soup_db'
const DB_VERSION = 1
const STORE_NAME = 'puzzles'

export const dbService = {
  async initDB() {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
          store.createIndex('type', 'type')
        }
      }
    })
    return db
  },

  async getAllPuzzles() {
    const db = await this.initDB()
    return db.getAll(STORE_NAME)
  },

  async addPuzzle(puzzle) {
    const db = await this.initDB()
    return db.add(STORE_NAME, puzzle)
  },

  async updatePuzzle(puzzle) {
    const db = await this.initDB()
    return db.put(STORE_NAME, puzzle)
  },

  async deletePuzzle(id) {
    const db = await this.initDB()
    return db.delete(STORE_NAME, id)
  },

  async importPuzzles(puzzles) {
    const db = await this.initDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    await Promise.all([
      ...puzzles.map(puzzle => tx.store.add(puzzle)),
      tx.done
    ])
  },

  async exportPuzzles() {
    return this.getAllPuzzles()
  }
} 