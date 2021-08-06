#!/usr/bin/env python3

import csv
import os
from collections import defaultdict


def read_details_csv_files(location):
    data = defaultdict(list)

    fnames = [f for f in os.listdir(location)
              if f.endswith('csv') and f != 'master.csv']
    for name in fnames:
        # base = name.split('.')[0]
        with open(os.path.join(location, name)) as f:
            reader = iter(csv.reader(f))

            # headers = reader.next()
            headers = None
            for line in reader:
                headers = line
                break
            index = headers.index('Origin of the measure')

            # data[base] = []
            for line in reader:
                items = zip(headers, line)
                data[line[index]].append(dict(items))

    return data


def read_master_csv_files(location):
    data = []
    with open(os.path.join(location, 'master.csv')) as f:
        reader = iter(csv.reader(f))

        # headers = reader.next()
        headers = None
        for line in reader:
            headers = line
            break
        # index = headers.index('Origin of the measure')

        # data[base] = []
        for line in reader:
            items = zip(headers, line)
            data.append(dict(items))

    return data


OM = 'Origin of the measure'


def main():
    master_data = read_master_csv_files('./csv')
    data = read_details_csv_files('./csv')

    cursors = defaultdict(lambda: 0)
    for (i, line) in enumerate(master_data):
        measure_name = line[OM]
        master_data[i].update(data[measure_name][cursors[OM]])
        cursors[measure_name] += 1


if __name__ == "__main__":
    main()
