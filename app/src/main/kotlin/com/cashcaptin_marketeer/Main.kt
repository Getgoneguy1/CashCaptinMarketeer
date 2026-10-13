package com.cashcaptin_marketeer

data class Offer(
    val id: String,
    val title: String,
    val category: String,
    val keywords: List<String>,
    val affiliateUrl: String
)

fun main() {
    val sampleOffers = listOf(
        Offer(
            id = "101",
            title = "AI Copywriter Pro",
            category = "Software",
            keywords = listOf("ai", "writing", "copywriting", "marketing"),
            affiliateUrl = "https://example.com/aff/copywriter"
        ),
        Offer(
            id = "102",
            title = "High-Yield Savings Tracker",
            category = "Finance",
            keywords = listOf("finance", "savings", "money", "investing"),
            affiliateUrl = "https://example.com/aff/savings"
        )
    )

    println("WelcomeAboard CashCaptinMarketeer!")
    
    for (offer in sampleOffers) {
        println("Loaded Offer: ${offer.title}")
    }
}
