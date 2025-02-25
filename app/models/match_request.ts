import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

/**
 * @swagger
 * components:
 *  schemas:
 *    MatchRequest:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        matcherUserId:
 *          type: string
 *        matchedUserId:
 *          type: string
 *      required:
 *        - id
 *        - createdAt
 *        - updatedAt
 *        - matcherUserId
 *        - matchedUserId
 */
export default class MatchRequest extends BaseModel {
  @beforeCreate()
  static async createUUID(matchRequest: MatchRequest) {
    matchRequest.id = uuid()
  }

  @column({ isPrimary: true })
  declare id: string

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  declare updatedAt: DateTime | null

  /**
   * Matcher user relation
   */
  @column({ serializeAs: 'matcherUserId' })
  declare matcherUserId: User['id']
  @belongsTo(() => User, { foreignKey: 'matcherUserId' })
  declare matcherUser: BelongsTo<typeof User>

  /**
   * Matched user relation
   */
  @column({ serializeAs: 'matchedUserId' })
  declare matchedUserId: User['id']
  @belongsTo(() => User, { foreignKey: 'matchedUserId' })
  declare matchedUser: BelongsTo<typeof User>
}
