// Glitter Pilots Dashboard — Compost site usage (vendor pickup log)
// Auto-generated 2026-10-30 by compost_refresh.js — do not hand-edit.
// Source: Bennett Compost — Commercial Weight Tracking (vendor Google Sheet)
// 140 pickups, 2026-04-01 → 2026-10-30, 5 sites, 0 flags

const COMPOST_DATA = {
 "asOf": "2026-10-30",
 "generated": "2026-10-30",
 "source": "Bennett Compost — Commercial Weight Tracking (vendor Google Sheet)",
 "binGallons": 32,
 "lbsPerGallon": 4,
 "params": {
  "RECENT_N": 3,
  "BASELINE_N": 8,
  "MIN_BASELINE": 4,
  "DROP_RATIO": 0.6,
  "NETWORK_ADJ": 0.75,
  "MISSED_DAYS": 10,
  "FULL_OF_RECENT": 2
 },
 "network": {
  "ratio": 1.2,
  "weekGallons": 64,
  "weekLbs": 256,
  "weekPickups": 5
 },
 "sites": [
  {
   "key": "christian",
   "label": "901 Christian St",
   "code": "2100Christian",
   "note": null,
   "day": "Fri",
   "first": "2026-04-03",
   "last": "2026-10-30",
   "lastStatus": "pickup",
   "lastGallons": 24,
   "lastVisit": "2026-10-30",
   "pickups": 30,
   "skips": 1,
   "empties": 2,
   "fulls": 6,
   "gallons": 472,
   "lbs": 1888,
   "recentN": 3,
   "recentAvg": 13.3,
   "baselineN": 8,
   "baselineAvg": 12,
   "ratio": 1.11,
   "recentFulls": 0
  },
  {
   "key": "kimball",
   "label": "1901 Kimball St",
   "code": "1900Kimball",
   "note": null,
   "day": "Fri",
   "first": "2026-04-03",
   "last": "2026-10-30",
   "lastStatus": "pickup",
   "lastGallons": 16,
   "lastVisit": "2026-10-30",
   "pickups": 31,
   "skips": 0,
   "empties": 0,
   "fulls": 5,
   "gallons": 536,
   "lbs": 2144,
   "recentN": 3,
   "recentAvg": 18.7,
   "baselineN": 8,
   "baselineAvg": 15,
   "ratio": 1.24,
   "recentFulls": 0
  },
  {
   "key": "uber",
   "label": "840 N Uber St",
   "code": "1900Parrish",
   "note": null,
   "day": "Wed",
   "first": "2026-04-01",
   "last": "2026-10-28",
   "lastStatus": "pickup",
   "lastGallons": 8,
   "lastVisit": "2026-10-28",
   "pickups": 31,
   "skips": 0,
   "empties": 0,
   "fulls": 3,
   "gallons": 400,
   "lbs": 1600,
   "recentN": 3,
   "recentAvg": 10.7,
   "baselineN": 8,
   "baselineAvg": 10,
   "ratio": 1.07,
   "recentFulls": 0
  },
  {
   "key": "green",
   "label": "1501 Green St",
   "code": "1500Green",
   "note": null,
   "day": "Mon",
   "first": "2026-04-20",
   "last": "2026-10-26",
   "lastStatus": "pickup",
   "lastGallons": 8,
   "lastVisit": "2026-10-26",
   "pickups": 28,
   "skips": 0,
   "empties": 0,
   "fulls": 1,
   "gallons": 264,
   "lbs": 1056,
   "recentN": 3,
   "recentAvg": 10.7,
   "baselineN": 8,
   "baselineAvg": 8,
   "ratio": 1.33,
   "recentFulls": 0
  },
  {
   "key": "latona",
   "label": "1227 Latona St",
   "code": "1200Latona",
   "note": "Morgan's bin",
   "day": "Tue",
   "first": "2026-06-23",
   "last": "2026-10-27",
   "lastStatus": "pickup",
   "lastGallons": 8,
   "lastVisit": "2026-10-27",
   "pickups": 19,
   "skips": 0,
   "empties": 0,
   "fulls": 0,
   "gallons": 208,
   "lbs": 832,
   "recentN": 3,
   "recentAvg": 13.3,
   "baselineN": 8,
   "baselineAvg": 11,
   "ratio": 1.21,
   "recentFulls": 0
  }
 ],
 "pickups": [
  {
   "site": "uber",
   "date": "2026-04-01",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "christian",
   "date": "2026-04-03",
   "status": "empty",
   "gallons": 0,
   "lbs": 0,
   "desc": "empty"
  },
  {
   "site": "kimball",
   "date": "2026-04-03",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "uber",
   "date": "2026-04-08",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "christian",
   "date": "2026-04-10",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "kimball",
   "date": "2026-04-10",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "uber",
   "date": "2026-04-15",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "christian",
   "date": "2026-04-17",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "kimball",
   "date": "2026-04-17",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "green",
   "date": "2026-04-20",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "uber",
   "date": "2026-04-22",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "christian",
   "date": "2026-04-24",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-04-24",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "green",
   "date": "2026-04-27",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-04-29",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "christian",
   "date": "2026-05-01",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "kimball",
   "date": "2026-05-01",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "green",
   "date": "2026-05-04",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-05-06",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "christian",
   "date": "2026-05-08",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "kimball",
   "date": "2026-05-08",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-05-11",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-05-13",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-05-15",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "kimball",
   "date": "2026-05-15",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "green",
   "date": "2026-05-18",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-05-20",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "christian",
   "date": "2026-05-22",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-05-22",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "green",
   "date": "2026-05-26",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-05-27",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "christian",
   "date": "2026-05-29",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-05-29",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "green",
   "date": "2026-06-01",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-06-03",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-06-05",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-06-05",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "green",
   "date": "2026-06-08",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "uber",
   "date": "2026-06-10",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-06-12",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "kimball",
   "date": "2026-06-12",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-06-15",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-06-17",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-06-19",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "kimball",
   "date": "2026-06-19",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-06-22",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-06-23",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-06-24",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-06-26",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-06-26",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-06-29",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-06-30",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-07-01",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-07-03",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-07-03",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "green",
   "date": "2026-07-06",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-07-07",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-07-08",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-07-10",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-07-10",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "green",
   "date": "2026-07-13",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-07-14",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-07-15",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-07-17",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "kimball",
   "date": "2026-07-17",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "green",
   "date": "2026-07-20",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-07-21",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-07-22",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-07-24",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-07-24",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-07-27",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-07-28",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "uber",
   "date": "2026-07-29",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-07-31",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "kimball",
   "date": "2026-07-31",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-08-03",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-08-04",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-08-05",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-08-07",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "kimball",
   "date": "2026-08-07",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "green",
   "date": "2026-08-10",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-08-11",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-08-12",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-08-14",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "kimball",
   "date": "2026-08-14",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "green",
   "date": "2026-08-17",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-08-18",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-08-19",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-08-21",
   "status": "pickup",
   "gallons": 32,
   "lbs": 128,
   "desc": "1 full"
  },
  {
   "site": "kimball",
   "date": "2026-08-21",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-08-24",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-08-25",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-08-26",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-08-28",
   "status": "skip",
   "gallons": 0,
   "lbs": 0,
   "desc": "Skip"
  },
  {
   "site": "kimball",
   "date": "2026-08-28",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-08-31",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-09-01",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-09-02",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-09-04",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-09-04",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-09-08",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-09-08",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "uber",
   "date": "2026-09-09",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-09-11",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-09-11",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-09-14",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-09-15",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "uber",
   "date": "2026-09-16",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "christian",
   "date": "2026-09-18",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-09-18",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-09-21",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-09-22",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-09-23",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-09-25",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "kimball",
   "date": "2026-09-25",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-09-28",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-09-29",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-09-30",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "christian",
   "date": "2026-10-02",
   "status": "empty",
   "gallons": 0,
   "lbs": 0,
   "desc": "0"
  },
  {
   "site": "kimball",
   "date": "2026-10-02",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "green",
   "date": "2026-10-05",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-10-06",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-10-07",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-10-09",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-10-09",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-10-12",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-10-13",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-10-14",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "christian",
   "date": "2026-10-16",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-10-16",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "green",
   "date": "2026-10-19",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "latona",
   "date": "2026-10-20",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "uber",
   "date": "2026-10-21",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-10-23",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-10-23",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  },
  {
   "site": "green",
   "date": "2026-10-26",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "latona",
   "date": "2026-10-27",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "uber",
   "date": "2026-10-28",
   "status": "pickup",
   "gallons": 8,
   "lbs": 32,
   "desc": "1/4 full"
  },
  {
   "site": "christian",
   "date": "2026-10-30",
   "status": "pickup",
   "gallons": 24,
   "lbs": 96,
   "desc": "3/4 full"
  },
  {
   "site": "kimball",
   "date": "2026-10-30",
   "status": "pickup",
   "gallons": 16,
   "lbs": 64,
   "desc": "1/2 full"
  }
 ],
 "flags": [],
 "issues": [
  "1227 Latona St 9/1/2026: description \"1/4 full\" ≠ 16 gal — using the gallons column",
  "840 N Uber St 6/24/2026: description \"1/4 full\" ≠ 16 gal — using the gallons column"
 ]
};
if (typeof module !== 'undefined') module.exports = COMPOST_DATA;
