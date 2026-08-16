import { MenuItem, OrderStatus, Tag } from "@/types/order"
import { AnalyticsOrder } from "../hooks/use-order-analytics"

export type Availability = "all" | "available" | "unavailable"

export interface AnalyticsFilters {
    dateFrom: Date | null
    dateTo: Date | null
    tagIds: string[]
    availability: Availability
    search: string
}

export interface DrinkStat {
    menuItemId: string
    name: string
    drinkNumber: number
    available: boolean
    tags: Tag[]
    totalQuantity: number
    orderCount: number
    /** Average rating of orders containing this drink. Approximate: rating is
     * captured per order, not per drink, so an order with multiple drinks
     * contributes the same rating to each. */
    avgRating: number | null
    ratingSampleSize: number
    lastOrderedAt: string | null
}

export interface TagStat {
    tagId: string
    name: string
    totalQuantity: number
}

export interface TimeSeriesPoint {
    key: string
    label: string
    orders: number
    items: number
}

export interface AnalyticsSummary {
    totalOrders: number
    totalItemsServed: number
    uniqueGuests: number
    avgItemsPerOrder: number
    avgRating: number | null
    ratingResponses: number
    ratingCounts: [number, number, number, number, number]
    statusCounts: Partial<Record<OrderStatus, number>>
}

export function filterMenuItems(
    menuItems: MenuItem[],
    filters: Pick<AnalyticsFilters, "tagIds" | "availability" | "search">
): MenuItem[] {
    const search = filters.search.trim().toLowerCase()

    return menuItems.filter((item) => {
        if (filters.availability === "available" && !item.available) return false
        if (filters.availability === "unavailable" && item.available) return false
        if (filters.tagIds.length > 0 && !item.tags?.some((tag) => filters.tagIds.includes(tag.id))) return false
        if (search && !item.name?.toLowerCase().includes(search)) return false
        return true
    })
}

export function filterOrdersByDate(
    orders: AnalyticsOrder[],
    dateFrom: Date | null,
    dateTo: Date | null
): AnalyticsOrder[] {
    if (!dateFrom && !dateTo) return orders

    return orders.filter((order) => {
        const time = new Date(order.created_at).getTime()
        if (dateFrom && time < dateFrom.getTime()) return false
        if (dateTo && time > dateTo.getTime()) return false
        return true
    })
}

export function computeDrinkStats(orders: AnalyticsOrder[], menuItems: MenuItem[]): DrinkStat[] {
    const byId = new Map<string, DrinkStat>()

    for (const item of menuItems) {
        byId.set(item.id, {
            menuItemId: item.id,
            name: item.name,
            drinkNumber: item.drink_number,
            available: item.available,
            tags: item.tags ?? [],
            totalQuantity: 0,
            orderCount: 0,
            avgRating: null,
            ratingSampleSize: 0,
            lastOrderedAt: null,
        })
    }

    const ratingSums = new Map<string, number>()

    for (const order of orders) {
        const ratedInThisOrder = new Set<string>()

        for (const orderItem of order.items) {
            const stat = byId.get(orderItem.menu_item_id)
            if (!stat) continue

            stat.totalQuantity += orderItem.quantity
            stat.orderCount += 1
            if (!stat.lastOrderedAt || order.created_at > stat.lastOrderedAt) {
                stat.lastOrderedAt = order.created_at
            }

            if (order.rating && !ratedInThisOrder.has(orderItem.menu_item_id)) {
                ratedInThisOrder.add(orderItem.menu_item_id)
                stat.ratingSampleSize += 1
                ratingSums.set(stat.menuItemId, (ratingSums.get(stat.menuItemId) ?? 0) + order.rating)
            }
        }
    }

    for (const stat of Array.from(byId.values())) {
        if (stat.ratingSampleSize > 0) {
            stat.avgRating = (ratingSums.get(stat.menuItemId) ?? 0) / stat.ratingSampleSize
        }
    }

    return Array.from(byId.values())
}

export function computeTagStats(drinkStats: DrinkStat[], maxSlots = 6): TagStat[] {
    const byTag = new Map<string, TagStat>()

    for (const drink of drinkStats) {
        for (const tag of drink.tags) {
            const existing = byTag.get(tag.id) ?? { tagId: tag.id, name: tag.name, totalQuantity: 0 }
            existing.totalQuantity += drink.totalQuantity
            byTag.set(tag.id, existing)
        }
    }

    const sorted = Array.from(byTag.values())
        .filter((tag) => tag.totalQuantity > 0)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)

    if (sorted.length <= maxSlots) return sorted

    const top = sorted.slice(0, maxSlots - 1)
    const otherTotal = sorted.slice(maxSlots - 1).reduce((sum, tag) => sum + tag.totalQuantity, 0)
    return [...top, { tagId: "__other__", name: "Other", totalQuantity: otherTotal }]
}

export function computeTimeSeries(orders: AnalyticsOrder[], forceHourly = false): TimeSeriesPoint[] {
    if (orders.length === 0) return []

    const timestamps = orders.map((order) => new Date(order.created_at).getTime())
    const spanMs = Math.max(...timestamps) - Math.min(...timestamps)
    const bucketByHour = forceHourly || spanMs <= 24 * 60 * 60 * 1000
    const spansMultipleYears = spanMs > 330 * 24 * 60 * 60 * 1000

    const buckets = new Map<string, TimeSeriesPoint>()

    for (const order of orders) {
        const date = new Date(order.created_at)
        const key = bucketByHour ? date.toISOString().slice(0, 13) : date.toISOString().slice(0, 10)
        const label = bucketByHour
            ? date.toLocaleTimeString([], { hour: "numeric" })
            : date.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: spansMultipleYears ? "numeric" : undefined,
            })

        const existing = buckets.get(key) ?? { key, label, orders: 0, items: 0 }
        existing.orders += 1
        existing.items += order.items.reduce((sum, item) => sum + item.quantity, 0)
        buckets.set(key, existing)
    }

    return Array.from(buckets.values()).sort((a, b) => a.key.localeCompare(b.key))
}

export function computeSummary(orders: AnalyticsOrder[]): AnalyticsSummary {
    const totalOrders = orders.length
    const totalItemsServed = orders.reduce(
        (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0
    )
    const uniqueGuests = new Set(orders.map((order) => order.uid).filter(Boolean)).size
    const avgItemsPerOrder = totalOrders ? totalItemsServed / totalOrders : 0

    const ratingCounts: [number, number, number, number, number] = [0, 0, 0, 0, 0]
    let ratingSum = 0
    let ratingResponses = 0

    for (const order of orders) {
        if (order.rating && order.rating >= 1 && order.rating <= 5) {
            ratingCounts[order.rating - 1] += 1
            ratingSum += order.rating
            ratingResponses += 1
        }
    }

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1
        return acc
    }, {} as Partial<Record<OrderStatus, number>>)

    return {
        totalOrders,
        totalItemsServed,
        uniqueGuests,
        avgItemsPerOrder,
        avgRating: ratingResponses ? ratingSum / ratingResponses : null,
        ratingResponses,
        ratingCounts,
        statusCounts,
    }
}
