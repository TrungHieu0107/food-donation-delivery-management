// ** Types
import moment from 'moment'
import { NextRouter } from 'next/router'
import { randomBytes } from 'crypto'
import { ScheduledTime } from 'src/models'

/**
 * Check for URL queries as well for matching
 * Current URL & Item Path
 *
 * @param item
 * @param activeItem
 */
export const handleURLQueries = (router: NextRouter, path: string | undefined): boolean => {
  if (Object.keys(router.query).length && path) {
    const arr = Object.keys(router.query)
    console.log("path: ", path, "route: ", router.query[arr[0]] as string);
	const parts = path.split('/'); // Tách chuỗi bằng dấu "/"
	const result = parts[1]; 

    return router.asPath.includes(result) && router.asPath.includes(router.query[arr[0]] as string) && path !== '/'
  }

  return false
}

export const arrayRange = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step)

export const calculateDiffs = (from: string, to: string): number[] => {
  const a = moment(to)
  const b = moment(from)

  return arrayRange(0, a.diff(b, 'days'), 1)
}

export function capitalizeFirstLetter(str: string) {
  // Check if the input string is not empty
  if (str.length === 0) {
    return str
  }
  const [firstChar, ...rest] = str

  return `${firstChar.toUpperCase()}${rest.join('')}`
}

export const generateUUID = () => {
	const bytes = randomBytes(16)
	bytes[6] = (bytes[6] & 0x0f) | 0x40 // Set version to 4 (random)
	bytes[8] = (bytes[8] & 0x3f) | 0x80 // Set variant to RFC4122

	return bytes.toString('hex')
}

export function secondsToHoursMinutes(seconds: number) {
	const hours = Math.floor(seconds / 3600)
	const remainingSeconds = seconds % 3600

	let minutes = remainingSeconds > 0 ? Math.ceil(remainingSeconds / 900) * 15 : 0

	if (minutes === 60) {
		minutes = 0 // Hours increment already handled by Math.ceil on hours
	}

	// Construct the result string efficiently
	return `${hours > 0 ? `${hours} giờ ` : ''}${minutes > 0 ? `${minutes} phút` : ''}`.trim()
}

export function sortScheduledTimes(times: ScheduledTime[]): ScheduledTime[] {
	return times.sort((a, b) => {
		// Sort by day
		if (a.day === undefined) return 1
		if (b.day === undefined) return -1

		return a.day.localeCompare(b.day)
	})
}

export function groupByMonth(times: ScheduledTime[]): Record<string, ScheduledTime[]> {
	const grouped: Record<string, ScheduledTime[]> = {}

	times.forEach((time) => {
		if (time.day) {
			const monthKey = time.day.substring(0, 7) // Extracts 'YYYY-MM'

			if (!grouped[monthKey]) {
				grouped[monthKey] = []
			}

			// Add the current time to the appropriate group
			grouped[monthKey].push(time)
		}
	})

	return grouped
}

export function formateDateDDMMYYYYHHMM(value: string) {
	if (!value || value === '_') return '_'

	const date = moment(value).format('DD/MM/YYYY')
	const time = moment(value).format('HH:mm')

	return `${date} lúc ${time}`
}

export function formateDateDDMMYYYY(value: string) {
	if (!value || value === '_') return '_'

	const date = moment(value).format('DD/MM/YYYY')

	return `${date}`
}

export function getBulkyLevel(volumnPercent: number) {
	if (volumnPercent < 50) return 'NOT_BULKY'
	else if (volumnPercent >= 50 && volumnPercent < 80) return 'BULKY'
	else return 'VERY_BULKY'
}

export function isNumber(input: any) {
	const regex = /^\d+$/

	return regex.test(input)
}

export function compareWithCurrentTime(date: string, timeString: string): boolean {
	if (date === '' || timeString === '') return false
	const timeToCompare = moment(timeString, 'YYYY-MM-DD HH:mm')
	const now = moment()

	if (timeToCompare.isBefore(now)) {
		return true
	} else if (timeToCompare.isAfter(now)) {
		return false
	} else {
		return false
	}
}

export function findAllDuplicates(arr: string[]): Map<string, number[]> {
	const indexMap = new Map<string, number[]>()

	arr.forEach((value, index) => {
		if (!indexMap.has(value)) {
			indexMap.set(value, [])
		}
		indexMap.get(value)?.push(index)
	})

	// Filter out values that only occurred once
	for (const [key, indices] of indexMap) {
		if (indices.length === 1) {
			indexMap.delete(key)
		}
	}

	return indexMap
}


export const digitsOnly = (value: any) => /^\d+$/.test(value)