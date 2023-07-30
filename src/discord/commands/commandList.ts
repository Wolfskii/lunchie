import { Command } from '../interfaces/Command'
import { today, tomorrow, week, idag, imorgon, vecka } from './menu'

export const CommandList: Command[] = [today, tomorrow, week, idag, imorgon, vecka]
