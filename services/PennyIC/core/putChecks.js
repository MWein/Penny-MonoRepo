// DELETE LATER
// This is for keeping track of what was selected

const selection = [
  {
    symbol: 'CLOV220513P00002500',
    underlying: 'CLOV',
    type: 'put',
    strike: 2.5,
    premium: 30,
    expiration: '2022-05-13',
    delta: 0.4571380020886217,
    perc: 12
  },
  {
    symbol: 'COIN220513P00083000',
    underlying: 'COIN',
    type: 'put',
    strike: 83,
    premium: 910,
    expiration: '2022-05-13',
    delta: 0.3361041888672646,
    perc: 10.96
  },
  {
    symbol: 'PTON220513P00013500',
    underlying: 'PTON',
    type: 'put',
    strike: 13.5,
    premium: 146,
    expiration: '2022-05-13',
    delta: 0.330317909104236,
    perc: 10.81
  },
  {
    symbol: 'RIVN220513P00023000',
    underlying: 'RIVN',
    type: 'put',
    strike: 23,
    premium: 214,
    expiration: '2022-05-13',
    delta: 0.3434483505310779,
    perc: 9.3
  },
  {
    symbol: 'AMC220513P00012500',
    underlying: 'AMC',
    type: 'put',
    strike: 12.5,
    premium: 112,
    expiration: '2022-05-13',
    delta: 0.3645305265405014,
    perc: 8.96
  },
  {
    symbol: 'RIOT220513P00007500',
    underlying: 'RIOT',
    type: 'put',
    strike: 7.5,
    premium: 64,
    expiration: '2022-05-13',
    delta: 0.2924190707717839,
    perc: 8.53
  },
  {
    symbol: 'GME220513P00101000',
    underlying: 'GME',
    type: 'put',
    strike: 101,
    premium: 715,
    expiration: '2022-05-13',
    delta: 0.4271828592138787,
    perc: 7.08
  },
  {
    symbol: 'RCL220513P00065000',
    underlying: 'RCL',
    type: 'put',
    strike: 65,
    premium: 435,
    expiration: '2022-05-13',
    delta: 0.5165348440541148,
    perc: 6.69
  },
  {
    symbol: 'WKHS220513P00002500',
    underlying: 'WKHS',
    type: 'put',
    strike: 2.5,
    premium: 16,
    expiration: '2022-05-13',
    delta: 0.4015426301006673,
    perc: 6.4
  },
  {
    symbol: 'DKNG220513P00011000',
    underlying: 'DKNG',
    type: 'put',
    strike: 11,
    premium: 70,
    expiration: '2022-05-13',
    delta: 0.3400343274171729,
    perc: 6.36
  },
  {
    symbol: 'ACB220513P00002500',
    underlying: 'ACB',
    type: 'put',
    strike: 2.5,
    premium: 14,
    expiration: '2022-05-13',
    delta: 0.3621508128092853,
    perc: 5.6
  },
  {
    symbol: 'SQ220513P00083000',
    underlying: 'SQ',
    type: 'put',
    strike: 83,
    premium: 400,
    expiration: '2022-05-13',
    delta: 0.4003885919799295,
    perc: 4.82
  },
  {
    symbol: 'ARKK220513P00041000',
    underlying: 'ARKK',
    type: 'put',
    strike: 41,
    premium: 194,
    expiration: '2022-05-13',
    delta: 0.3495644199749648,
    perc: 4.73
  },
  {
    symbol: 'CGC220513P00005500',
    underlying: 'CGC',
    type: 'put',
    strike: 5.5,
    premium: 25,
    expiration: '2022-05-13',
    delta: 0.3626319566531169,
    perc: 4.55
  },
  {
    symbol: 'SPCE220513P00006000',
    underlying: 'SPCE',
    type: 'put',
    strike: 6,
    premium: 27,
    expiration: '2022-05-13',
    delta: 0.3458142441574985,
    perc: 4.5
  },
  {
    symbol: 'CHPT220513P00010500',
    underlying: 'CHPT',
    type: 'put',
    strike: 10.5,
    premium: 47,
    expiration: '2022-05-13',
    delta: 0.3915907125432319,
    perc: 4.48
  },
  {
    symbol: 'ZM220513P00093000',
    underlying: 'ZM',
    type: 'put',
    strike: 93,
    premium: 410,
    expiration: '2022-05-13',
    delta: 0.3984170678498103,
    perc: 4.41
  },
  {
    symbol: 'GPRO220513P00006500',
    underlying: 'GPRO',
    type: 'put',
    strike: 6.5,
    premium: 28,
    expiration: '2022-05-13',
    delta: 0.4238512549157134,
    perc: 4.31
  },
  {
    symbol: 'DIS220513P00107000',
    underlying: 'DIS',
    type: 'put',
    strike: 107,
    premium: 455,
    expiration: '2022-05-13',
    delta: 0.4364321826914598,
    perc: 4.25
  },
  {
    symbol: 'NIO220513P00013000',
    underlying: 'NIO',
    type: 'put',
    strike: 13,
    premium: 55,
    expiration: '2022-05-13',
    delta: 0.3053708470500978,
    perc: 4.23
  },
  {
    symbol: 'MRNA220513P00136000',
    underlying: 'MRNA',
    type: 'put',
    strike: 136,
    premium: 565,
    expiration: '2022-05-13',
    delta: 0.4144003781672978,
    perc: 4.15
  },
  {
    symbol: 'UBER220513P00023000',
    underlying: 'UBER',
    type: 'put',
    strike: 23,
    premium: 93,
    expiration: '2022-05-13',
    delta: 0.2824483291679035,
    perc: 4.04
  },
  {
    symbol: 'ABNB220513P00119000',
    underlying: 'ABNB',
    type: 'put',
    strike: 119,
    premium: 465,
    expiration: '2022-05-13',
    delta: 0.3145625320492563,
    perc: 3.91
  },
  {
    symbol: 'SNAP220513P00023000',
    underlying: 'SNAP',
    type: 'put',
    strike: 23,
    premium: 89,
    expiration: '2022-05-13',
    delta: 0.3184059273798396,
    perc: 3.87
  },
  {
    symbol: 'PLUG220513P00015000',
    underlying: 'PLUG',
    type: 'put',
    strike: 15,
    premium: 58,
    expiration: '2022-05-13',
    delta: 0.2151278106762659,
    perc: 3.87
  },
  {
    symbol: 'CCL220513P00014000',
    underlying: 'CCL',
    type: 'put',
    strike: 14,
    premium: 52,
    expiration: '2022-05-13',
    delta: 0.3064018913231683,
    perc: 3.71
  },
  {
    symbol: 'BABA220513P00084000',
    underlying: 'BABA',
    type: 'put',
    strike: 84,
    premium: 310,
    expiration: '2022-05-13',
    delta: 0.4191954666532598,
    perc: 3.69
  },
  {
    symbol: 'TSLA220513P00785000',
    underlying: 'TSLA',
    type: 'put',
    strike: 785,
    premium: 2890,
    expiration: '2022-05-13',
    delta: 0.3364390516592257,
    perc: 3.68
  },
  {
    symbol: 'AMD220513P00086000',
    underlying: 'AMD',
    type: 'put',
    strike: 86,
    premium: 305,
    expiration: '2022-05-13',
    delta: 0.3622251259453267,
    perc: 3.55
  },
  {
    symbol: 'NVDA220513P00167500',
    underlying: 'NVDA',
    type: 'put',
    strike: 167.5,
    premium: 580,
    expiration: '2022-05-13',
    delta: 0.3350394964631366,
    perc: 3.46
  },
  {
    symbol: 'NCLH220513P00015500',
    underlying: 'NCLH',
    type: 'put',
    strike: 15.5,
    premium: 53,
    expiration: '2022-05-13',
    delta: 0.2333108413909912,
    perc: 3.42
  },
  {
    symbol: 'UAL220513P00043500',
    underlying: 'UAL',
    type: 'put',
    strike: 43.5,
    premium: 146,
    expiration: '2022-05-13',
    delta: 0.3574713434050883,
    perc: 3.36
  },
  {
    symbol: 'NFLX220513P00172500',
    underlying: 'NFLX',
    type: 'put',
    strike: 172.5,
    premium: 570,
    expiration: '2022-05-13',
    delta: 0.3717694686597022,
    perc: 3.3
  },
  {
    symbol: 'FUBO220513P00002500',
    underlying: 'FUBO',
    type: 'put',
    strike: 2.5,
    premium: 8,
    expiration: '2022-05-13',
    delta: 0.199879026364059,
    perc: 3.2
  },
  {
    symbol: 'MRO220513P00024000',
    underlying: 'MRO',
    type: 'put',
    strike: 24,
    premium: 76,
    expiration: '2022-05-13',
    delta: 0.2414698942073954,
    perc: 3.17
  },
  {
    symbol: 'BA220513P00133000',
    underlying: 'BA',
    type: 'put',
    strike: 133,
    premium: 400,
    expiration: '2022-05-13',
    delta: 0.2902214101754804,
    perc: 3.01
  },
  {
    symbol: 'PLTR220513P00007000',
    underlying: 'PLTR',
    type: 'put',
    strike: 7,
    premium: 21,
    expiration: '2022-05-13',
    delta: 0.271078099937214,
    perc: 3
  },
  {
    symbol: 'GM220513P00038500',
    underlying: 'GM',
    type: 'put',
    strike: 38.5,
    premium: 115,
    expiration: '2022-05-13',
    delta: 0.4628375607484314,
    perc: 2.99
  },
  {
    symbol: 'AAL220513P00016000',
    underlying: 'AAL',
    type: 'put',
    strike: 16,
    premium: 46,
    expiration: '2022-05-13',
    delta: 0.2821210390770784,
    perc: 2.88
  },
  {
    symbol: 'MA220513P00332500',
    underlying: 'MA',
    type: 'put',
    strike: 332.5,
    premium: 950,
    expiration: '2022-05-13',
    delta: 0.5429385453863527,
    perc: 2.86
  },
  {
    symbol: 'SOFI220513P00005000',
    underlying: 'SOFI',
    type: 'put',
    strike: 5,
    premium: 14,
    expiration: '2022-05-13',
    delta: 0.178776539349293,
    perc: 2.8
  },
  {
    symbol: 'HOOD220513P00009000',
    underlying: 'HOOD',
    type: 'put',
    strike: 9,
    premium: 24,
    expiration: '2022-05-13',
    delta: 0.2477017762332913,
    perc: 2.67
  },
  {
    symbol: 'FB220513P00195000',
    underlying: 'FB',
    type: 'put',
    strike: 195,
    premium: 515,
    expiration: '2022-05-13',
    delta: 0.3869273827509117,
    perc: 2.64
  },
  {
    symbol: 'GOOG220513P02285000',
    underlying: 'GOOG',
    type: 'put',
    strike: 2285,
    premium: 6000,
    expiration: '2022-05-13',
    delta: 0.4862988869578109,
    perc: 2.63
  },
  {
    symbol: 'XOM220513P00084000',
    underlying: 'XOM',
    type: 'put',
    strike: 84,
    premium: 221,
    expiration: '2022-05-13',
    delta: 0.2991379898977344,
    perc: 2.63
  },
  {
    symbol: 'BB220513P00005000',
    underlying: 'BB',
    type: 'put',
    strike: 5,
    premium: 12,
    expiration: '2022-05-13',
    delta: 0.288651194425536,
    perc: 2.4
  },
  {
    symbol: 'SONY220513P00079000',
    underlying: 'SONY',
    type: 'put',
    strike: 79,
    premium: 185,
    expiration: '2022-05-13',
    delta: 0.3448762691611165,
    perc: 2.34
  },
  {
    symbol: 'AAPL220513P00152500',
    underlying: 'AAPL',
    type: 'put',
    strike: 152.5,
    premium: 350,
    expiration: '2022-05-13',
    delta: 0.498339606447436,
    perc: 2.3
  },
  {
    symbol: 'DAL220513P00038000',
    underlying: 'DAL',
    type: 'put',
    strike: 38,
    premium: 87,
    expiration: '2022-05-13',
    delta: 0.2868969617516173,
    perc: 2.29
  },
  {
    symbol: 'SBUX220513P00073500',
    underlying: 'SBUX',
    type: 'put',
    strike: 73.5,
    premium: 163,
    expiration: '2022-05-13',
    delta: 0.3532101675232694,
    perc: 2.22
  },
  {
    symbol: 'ZNGA220513P00007500',
    underlying: 'ZNGA',
    type: 'put',
    strike: 7.5,
    premium: 16,
    expiration: '2022-05-13',
    delta: 0.2731182073561066,
    perc: 2.13
  },
  {
    symbol: 'WFC220513P00044000',
    underlying: 'WFC',
    type: 'put',
    strike: 44,
    premium: 91,
    expiration: '2022-05-13',
    delta: 0.5571552826076863,
    perc: 2.07
  },
  {
    symbol: 'V220513P00192500',
    underlying: 'V',
    type: 'put',
    strike: 192.5,
    premium: 395,
    expiration: '2022-05-13',
    delta: 0.4019469035728741,
    perc: 2.05
  },
  {
    symbol: 'LUV220513P00043500',
    underlying: 'LUV',
    type: 'put',
    strike: 43.5,
    premium: 85,
    expiration: '2022-05-13',
    delta: 0.3268117782711423,
    perc: 1.95
  },
  {
    symbol: 'COST220513P00500000',
    underlying: 'COST',
    type: 'put',
    strike: 500,
    premium: 940,
    expiration: '2022-05-13',
    delta: 0.4182849123827765,
    perc: 1.88
  },
  {
    symbol: 'F220513P00013000',
    underlying: 'F',
    type: 'put',
    strike: 13,
    premium: 24,
    expiration: '2022-05-13',
    delta: 0.2615879108264276,
    perc: 1.85
  },
  {
    symbol: 'XLE220513P00076000',
    underlying: 'XLE',
    type: 'put',
    strike: 76,
    premium: 140,
    expiration: '2022-05-13',
    delta: 0.3092793027031048,
    perc: 1.84
  },
  {
    symbol: 'PFE220513P00048500',
    underlying: 'PFE',
    type: 'put',
    strike: 48.5,
    premium: 88,
    expiration: '2022-05-13',
    delta: 0.5454269102570597,
    perc: 1.81
  },
  {
    symbol: 'JNJ220513P00180000',
    underlying: 'JNJ',
    type: 'put',
    strike: 180,
    premium: 325,
    expiration: '2022-05-13',
    delta: 0.7798997198952573,
    perc: 1.81
  },
  {
    symbol: 'INTC220513P00043000',
    underlying: 'INTC',
    type: 'put',
    strike: 43,
    premium: 78,
    expiration: '2022-05-13',
    delta: 0.4128623440342338,
    perc: 1.81
  },
  {
    symbol: 'JPM220513P00122000',
    underlying: 'JPM',
    type: 'put',
    strike: 122,
    premium: 218,
    expiration: '2022-05-13',
    delta: 0.5123610970975185,
    perc: 1.79
  },
  {
    symbol: 'BAC220513P00036000',
    underlying: 'BAC',
    type: 'put',
    strike: 36,
    premium: 61,
    expiration: '2022-05-13',
    delta: 0.4157556407101478,
    perc: 1.69
  },
  {
    symbol: 'WMT220513P00152500',
    underlying: 'WMT',
    type: 'put',
    strike: 152.5,
    premium: 257,
    expiration: '2022-05-13',
    delta: 0.5700919306427888,
    perc: 1.69
  },
  {
    symbol: 'QQQ220511P00298000',
    underlying: 'QQQ',
    type: 'put',
    strike: 298,
    premium: 479,
    expiration: '2022-05-11',
    delta: 0.4300567239106422,
    perc: 1.61
  },
  {
    symbol: 'IWM220511P00175000',
    underlying: 'IWM',
    type: 'put',
    strike: 175,
    premium: 238,
    expiration: '2022-05-11',
    delta: 0.3592210676615234,
    perc: 1.36
  },
  {
    symbol: 'XLK220513P00135000',
    underlying: 'XLK',
    type: 'put',
    strike: 135,
    premium: 180,
    expiration: '2022-05-13',
    delta: 0.4342501890071591,
    perc: 1.33
  },
  {
    symbol: 'T220513P00019500',
    underlying: 'T',
    type: 'put',
    strike: 19.5,
    premium: 25,
    expiration: '2022-05-13',
    delta: 0.4185009056089191,
    perc: 1.28
  },
  {
    symbol: 'DIA220513P00323000',
    underlying: 'DIA',
    type: 'put',
    strike: 323,
    premium: 400,
    expiration: '2022-05-13',
    delta: 0.4571100672162047,
    perc: 1.24
  },
  {
    symbol: 'SPY220511P00399000',
    underlying: 'SPY',
    type: 'put',
    strike: 399,
    premium: 475,
    expiration: '2022-05-11',
    delta: 0.4157207738815479,
    perc: 1.19
  },
  {
    symbol: 'TWTR220513P00047500',
    underlying: 'TWTR',
    type: 'put',
    strike: 47.5,
    premium: 54,
    expiration: '2022-05-13',
    delta: 0.2683299783092568,
    perc: 1.14
  },
  {
    symbol: 'ET220513P00010500',
    underlying: 'ET',
    type: 'put',
    strike: 10.5,
    premium: 12,
    expiration: '2022-05-13',
    delta: 0.2193712934752159,
    perc: 1.14
  },
  {
    symbol: 'XLF220513P00033500',
    underlying: 'XLF',
    type: 'put',
    strike: 33.5,
    premium: 35,
    expiration: '2022-05-13',
    delta: 0.3577643613826579,
    perc: 1.04
  },
  {
    symbol: 'TLRY220513P00004000',
    underlying: 'TLRY',
    type: 'put',
    strike: 4,
    premium: 4,
    expiration: '2022-05-13',
    delta: 0.1021767156895078,
    perc: 1
  },
  {
    symbol: 'KO220513P00064000',
    underlying: 'KO',
    type: 'put',
    strike: 64,
    premium: 56,
    expiration: '2022-05-13',
    delta: 0.3775290658413144,
    perc: 0.88
  },
  {
    symbol: 'XLU220513P00071500',
    underlying: 'XLU',
    type: 'put',
    strike: 71.5,
    premium: 38,
    expiration: '2022-05-13',
    delta: 0.4344396568846742,
    perc: 0.53
  },
  {
    symbol: 'XLV220513P00126000',
    underlying: 'XLV',
    type: 'put',
    strike: 126,
    premium: 62,
    expiration: '2022-05-13',
    delta: 0.3847446216477428,
    perc: 0.49
  },
  {
    symbol: 'NOK220513P00004500',
    underlying: 'NOK',
    type: 'put',
    strike: 4.5,
    premium: 2,
    expiration: '2022-05-13',
    delta: 0.1184383271521116,
    perc: 0.44
  },
  {
    symbol: 'XLY220513P00151000',
    underlying: 'XLY',
    type: 'put',
    strike: 151,
    premium: 50,
    expiration: '2022-05-13',
    delta: 0.3688530511272782,
    perc: 0.33
  },
  {
    symbol: 'XLP220513P00077000',
    underlying: 'XLP',
    type: 'put',
    strike: 77,
    premium: 20,
    expiration: '2022-05-13',
    delta: 0.5241226347411507,
    perc: 0.26
  },
  {
    symbol: 'TSM220513P00079000',
    underlying: 'TSM',
    type: 'put',
    strike: 79,
    premium: 18,
    expiration: '2022-05-13',
    delta: 0.0589713093334223,
    perc: 0.23
  },
  {
    symbol: 'XLI220513P00093000',
    underlying: 'XLI',
    type: 'put',
    strike: 93,
    premium: 20,
    expiration: '2022-05-13',
    delta: 0.4082970730068533,
    perc: 0.22
  },
  {
    symbol: 'MSFT220513P00185000',
    underlying: 'MSFT',
    type: 'put',
    strike: 185,
    premium: 0,
    expiration: '2022-05-13',
    delta: 1e-16,
    perc: 0
  },
  {
    symbol: 'LCID220513P00009500',
    underlying: 'LCID',
    type: 'put',
    strike: 9.5,
    premium: 0,
    expiration: '2022-05-13',
    delta: 7e-16,
    perc: 0
  },
  {
    symbol: 'WISH220513P00001000',
    underlying: 'WISH',
    type: 'put',
    strike: 1,
    premium: 0,
    expiration: '2022-05-13',
    delta: 0.004589758489157,
    perc: 0
  }
]