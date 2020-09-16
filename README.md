# Spaghetti Money APY calculator
Get your APY for Spaghetti.finance (adaptable to others)
## Instructions
```
npm install
cp sample.env .env
vim .env
```

Add your infura key and run it

```node SpaghettiMoney_APY.js```

## Results preview
```
#### YFI ####
Pool total rewards 141429 PASTA/day = $478.03k
$100k stake rewards 433 PASTA/day = $1.46k
APY : 157.98%

#### LINK ####
Staked 791807LINK = $13.03M
Pool total rewards 141429 PASTA/day = $478.03k
$100k stake rewards 1086 PASTA/day = $3.67k
APY : 396.32%

#### LEND ####
Staked 14989980LEND = $8.82M
Pool total rewards 141429 PASTA/day = $478.03k
$100k stake rewards 1604 PASTA/day = $5.42k
APY : 585.33%

#### COMP ####
Staked 19975COMP = $3.86M
Pool total rewards 141429 PASTA/day = $478.03k
$100k stake rewards 3660 PASTA/day = $12.37k
APY : 1336.03%

#### MKR ####
Staked 16651MKR = $11.23M
Pool total rewards 141429 PASTA/day = $478.03k
$100k stake rewards 1260 PASTA/day = $4.26k
APY : 459.80%

#### SNX ####
Staked 1718117SNX = $10.33M
Pool total rewards 141429 PASTA/day = $478.03k
$100k stake rewards 1370 PASTA/day = $4.63k
APY : 499.92%

#### WBTC ####
Staked 0WBTC = $0.00M
Pool total rewards 141429 PASTA/day = $478.03k
$100k stake rewards 12751475776446 PASTA/day = $43099988124.39k
APY : 4654288658402.87%

#### WETH ####
Staked 48967WETH = $20.65M
Pool total rewards 141429 PASTA/day = $478.03k
$100k stake rewards 685 PASTA/day = $2.32k
APY : 250.02%

#### TVL ### : $100.58M
```

# TimeLockDecoder

Decode timelocked transactions to know changes made in advance
Should work for all sushi clones in theory

## Instructions
```
npm install
cp sample.env .env
vim .env
```
Export the list of transactions from Etherscan into SakeTimelockTransactions.json
Export the Timelock Abi and Sushi/Sake/emoji coin ChefMaster Abi into their own json files
Add your infura key and run it

```node decodeTimeLocks.js```

## Results preview
```
#0 set Pool 24 alloc 100
Sent 15/9 02:47:01 ETA 17/9 02:51:41
#1 set Pool 11 alloc 500
Sent 15/9 02:45:31 ETA 17/9 02:51:41
#2 set Pool 18 alloc 20
Sent 15/9 02:44:21 ETA 17/9 02:51:41
#3 add LP SakeToken/SushiToken alloc 500
Sent 15/9 02:42:24 ETA 17/9 02:51:41
#4 set Pool 22 alloc 150
Sent 15/9 02:37:10 ETA 15/9 01:28:58
#5 set Pool 21 alloc 150
Sent 15/9 02:36:12 ETA 15/9 01:28:58
#6 set Pool 20 alloc 150
Sent 15/9 02:35:15 ETA 15/9 01:28:58
#7 set Pool 19 alloc 100
Sent 15/9 02:34:26 ETA 15/9 01:28:58
#8 set Pool 18 alloc 100
Sent 15/9 02:33:20 ETA 15/9 01:28:58
#9 set Pool 15 alloc 20
Sent 15/9 02:31:49 ETA 15/9 01:28:58
#10 set Pool 14 alloc 20
Sent 15/9 02:29:29 ETA 15/9 01:28:58
#11 set Pool 12 alloc 150
Sent 15/9 02:26:14 ETA 15/9 01:28:58
#12 set Pool 9 alloc 20
Sent 15/9 02:25:27 ETA 15/9 01:28:58
#13 set Pool 6 alloc 20
Sent 15/9 02:23:21 ETA 15/9 01:28:58
#14 set Pool 23 alloc 150
Sent 15/9 02:21:41 ETA 15/9 02:00:00
#15 add LP Bounce Token/Wrapped Ether alloc 150
Sent 15/9 02:18:56 ETA 15/9 02:00:00
```