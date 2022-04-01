
# Penny V4

## TL;DR

Penny is a trading bot that will sell weekly [covered calls](https://www.investopedia.com/terms/c/coveredcall.asp) and [cash-secured puts](https://www.investopedia.com/terms/n/nakedput.asp).

UPDATE: Actually, it sells spreads now. Iron condors, actually. Might be taking advantage of high gamma on same-week expirations and buy them instead. We'll see.

## Legal Stuff

By using Penny or any software that may be derived from Penny for your own portfolio you agree to the following:

- I, the author, am not responsible for any damages you will definitely suffer caused by this program or any derivatives thereof.

- This readme and the code itself will be used for education purposes only. The kind of education you get from an underfunded community college taught by a professor who faked his credentials to get hired and lost his entire 401k daytrading Gamestop in a manner befitting the r/WallStreetBets hall of fame.

- Any of my personal success with either the program or strategies I use that I share in this readme shall not be construed as a guarantee of success.

- You acknowledge and accept that this program was conceived and written by an idiot with no financial background whatsoever and less than 10 ~~unsuccessful~~ years of trading experience.

If you use this program on a real account you will lose money. <- This is financial advice.

## Terms That I Probably Defined Incorrectly

- **Option**: A contract to buy or sell 100 shares of stock at a certain strike on or before the expiration date. The Europeans do it slightly differently but Europe doesn't matter.

- **Underlying**: Stonk.

- **Strike**: The price where the buyer and seller agree to exchange the shares, regardless of the current market price.

- **Premium**: Tendies received from selling an option.

- **Call**: An option where the buyer agrees to buy 100 shares of a stock if the price reaches above the strike on expiration.

- **Put**: An option where the buyer agrees to sell 100 shares of a stock if the price falls below the strike on expiration.

- **Delta**: Not even going to try. But for our purposes the delta is essentially the probability that the stock will reach a certain price on expiration. Not really, but kinda. A 0.30 delta is where the smart people say there's a good balance between risk and reward as it represents a 70% chance of the option expiring worthless.

- **Theta**: Also known as **Theta Decay**. This is the rate at which the option loses value. Typically, theta decay starts off slow and exponentially speeds up around the 30-45 day mark. Never EVER buy options with a high theta unless you're cool with watching your money evaporate. Selling options around this time is a good idea though.

- **Implied Volatility**: No idea how this is derived, but this is how much the market expects the stock to move in either direction. IV is typically high when there is an unknown of some kind, like a pending earnings call or an economic pissing match with China. When IV is high, the options premium is high.

- **IV Rank**: Implied volatility will be different for every stock. Telsa's chart, for example, looks like an arrhythmic heart rate monitor. At&T has been hovering around the same price for a long time. What you want to focus on is IV Rank because that will tell you when implied volatility is higher or lower than normal for a particular stock. 50% or higher means that IV is higher than it's 52-week average. [Market Chameleon](https://marketchameleon.com/Overview/AAPL/IV/) is a good place to look... for a fee.

- **Covered Call**: A strategy where you own 100 shares of a certain stock and sell a call option to some r/WallStreetBets gambler. Ideally, the underlying stock would trade sideways up until expiration so you can keep both the premium and the shares. You can lose out on some tendies if the underlying skyrockets above the strike. Should only be attempted on blue chip stocks or index funds that you actually want to own long term. Don't go chasing high premiums. The premiums could be high but the underlying stock might be s***t that brokers will make fun of you for owning.

- **Cash-Secured Put**. This is a strategy where you don't own the shares but have the money to buy them at whatever strike price you sell the option for. If you sell a put on AAPL for $147, your broker will hold on to $14,700 as collateral.

- **Bear Call Spread**. This is a strategy where you sell a call, then buy a call and a higher strike. This strategy brings the tendies if the stock price is below the lower strike on expiration.

- **Bull Put Spread**. This is a strategy where you sell a put, then buy a put and a lower strike. This strategy brings the tendies if the stock price is above the higher strike on expiration.

- **Iron Condor**. A combination of a Bear Call Spread and Bull Put Spread. An Iron Condor wins when the stock price is between the strikes.

- **Reverse Iron Condor**. Same thing as an Iron Condor except you're buying what you're selling and selling what you're buying. The tendies come in when the stock price is outside of the two spreads. It is not a great long term strategy but short term (1 week) it's not bad.

- **Assignment**: When an option executes and you fulfil your side of the contract to either buy or sell shares at the agreed upon price. This can be bad if the actual market price is way higher than the strike you have to sell the shares for. The buyer may choose to execute an option earlier than the expiration date, especially if a dividend is coming.

- **Buy to Close**: When you sell an option and buy the same option on the same underlying at the same strike back, thereby destroying the contract.

- **Day-Trade**: Where you buy and sell the same underlying or option with the same underlying within the same trading session.

- **Day-Trader Rule**: That stupid SEC rule that says an American brokerage won't allow any account with less than $25k to day-trade more than 3 times in a 5-day period. Really annoying but probably delayed the inevitable foreclosures of many r/WallStreetBets homes. You could get around this through the use of some shady overseas broker. But that might be illegal, idk. I wouldn't try your luck.

Learn more at https://www.youtube.com/channel/UCkcnYVAVZQOB-nXHechtXDg (NSFW but hilarious)
https://www.youtube.com/channel/UCfMiRVQJuTj3NpZZP1tKShQ (Slightly less NSFW but entertaining)
https://www.youtube.com/user/TDAmeritrade (SFW but not funny at all)

## New monorepo and tech stack!!!

Penny is now being converted into a monorepo and will be rewritten in TypeScript. Penny and Penny-Data had a ton of code that was not easily shared. I found myself copying and pasting a bunch of code. As the apps grew it became more difficult to keep them updated and in general was not good practice. I've also decided to convert the project to TypeScript. The legacy Penny, Penny-Data, and PennyUI projects will eventually be merged into this one.

## New strategy

The original strategy was to sell covered calls and cash secured puts. However, the market shit itself for a few months so I was holding stock for less than I bought it for. Penny wasn't able to sell any covered calls that were worth anything above the orginal assignment price. It's also a very capital intensive strategy.

New strategy, first pass. The new strategy is to sell weekly iron condors. All the smart people say this isn't a great idea because of gamma risk. They all say that you should sell them ~45 days to expiration. As options near expiration, gamma gets higher. High gamma = rapidly changing delta = rapidly changing premium = I'm losing most of the week until expiration day. Over the last month and some change, this strategy proved to be pretty profitable. But Monday-Thursday my returns showed negative until expiration day. Which leads to the second pass.

Second Pass. I'm buying the iron condors instead now. The working theory that I've so far proven to be consistent is that gamma tends to overtake theta decay for the first few days. All of the sold positions started off as losers even though the underlying price stayed between the inner strikes. The losses are generally the strongest on Tuesday and Wednesday before theta decay swoops in and and turns them into winners again. The new strategy will buy the same iron condors I was originally selling, and sell them off on wednesday at noon until I can find patterns to exploit. Like typical returns on the winners (for auto sell-to-close orders). It's also possible that I can buy and sell them every day except for Friday.

Advantages:
- Maximum Theoretical Loss is the exact amount spent to enter the positions
- Realistic Theoretical Loss is limited to the NET theta decay for the holding period
- Lower theoretical loss vs selling (For a 30/70 delta spread, max loss is 70 and max win is 30 for the short side. Compared with 70 max win and 30 max loss for the long side)
- High gamma increases the value of the spreads even if they don't end up in the "win zone"
- Much, much lower buy-in cost for similar dollar gains vs short spreads. What could be earned with $5000 collateral from selling spreads can be earned with $1500 used to buy them
- Less time exposure to the market. New strategy would be Monday-Wednesday instead of Monday-Friday
- The selling spreads strategy is extremely vulnerable to flash crashes like the great rona crash, the Ukraine crisis dip, whatever. However, the long strategy would stand to profit greatly in such a flash crash. However, the crash would need to happen between Monday and Wednesday so capture is less likely.

Disadvantages:
- Theta decay. If the positions are held to expiration (such as if the API fails for whatever reason), all money spent on them is lost except for the ones in the win zone.
- Not scalable. There are only so many weekly options and many of them are not liquid enough. I also crashed Tradier once trying to sell ~300 spreads. Prod might be more resiliant but I'd rather not try to find out the hard way. However, buying multiple of the same spreads might be the way to scale up.
- Unknowns. There could be other issues with this that I'm not yet aware of. I assume few people do this (or talk about it) because it takes a crapload of work to enter and exit the positions if you don't have a bot doing it for you. In my current test runs, there are over 100 spreads entered (about 50 full iron condors) which is an absurd amount of work to be doing manually with Robinhood. Most of my testing has been done during market turmoil which may not translate well to calmer markets. Backtesting (at least on the platforms I found) is limited to one ticker or two tickers at a time, and further limited to monthly options. The backtests I have performed worked out pretty well but this strategy primarily relies on having a large number of positions.

## App Composition

Penny will be composed of two API's and one UI. Why? Cause. It's to address all of my security concerns. The primary API will listen on any port to eliminate the attack vector against the actual app. So I only have to worry about the machine it runs on. Even a health endpoint that simply returns "true" to let me know Penny is up and running is a little too much risk to take on for an app that I'm writing to handle real money. And I was stupid enough to make this public but I'd be pretty stupid to tell you a**holes what cloud service I'm using. But I also focused on cybersecurity for my Masters degree. I learned to do some scary sh*t.

The primary API, the piece of Penny that will run in a cloud environment, will be as isolated as I can make it. It will only initiate network calls; it won't be able to receive them so none of you can get my tendies. Thats the piece that will handle all of the actual trading. It will also post a timestamp to MongoDB every 10 or so minutes so I can verify it's alive.

The other app will be deployed on my home network on a local machine away from the kind of people that managed to break into an old database of mine to leave a message extorting me for bitcoin =). Never leave default settings, folks. Not even the port number. That app will control all of the settings including a watchlist that I want Penny to work with. It will gather order information from the broker that I'll later use to calculate taxes, active positions, whatever data I want gathered and displayed in an accompanying UI written using React.

The UI will be the fun part. I plan on learning the D3 library to make graphs. It will show how much (estimated) tax I should be prepared to pay, the income generated on a weekly, monthly, and annual basis, and whatever else I want to show.

"But Mike! Won't your broker already have a lot of that stuff?" Yes. But I won't be able to see how much money I'm losing selling options amongst the noise of the ups and downs of whatever actual stocks I own. The broker may tell me I've lost $2000 in total account value yet made $1000 in realized gains through the options. Losses on stock value aren't real until I lock them in by selling. At least that's what I told myself in March 2020 to keep from going long rope. Diamond hands.
