# ch-stops

This is a simple script to download Switzerland stops as [GTFS-compatible CSV](https://developers.google.com/transit/gtfs/reference/stops-file).

The script uses the following dataset:

```
https://data.sbb.ch/explore/dataset/didok-liste/export/
```

The script produces CSV output in the following format:

```
"stop_id","stop_name","stop_lon","stop_lat","stop_code"
"8577774","Ecuvillens, Champ du Nod"," 7.09285733206","46.7587035206",""
```

# Usage

```
npm install
npm run export
```

# Disclaimer

Usage of this script may or may not be legal, use on your own risk.  
This repository provides only source code, no data.

# License

Source code is licensed under [BSD 2-clause license](LICENSE). No license and no guarantees implied on the produced data, produce and use on your own risk.