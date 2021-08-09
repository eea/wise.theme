#!/usr/bin/env python3

import csv
import json
import os
from collections import defaultdict

import tqdm
from elasticsearch import Elasticsearch
from elasticsearch.helpers import streaming_bulk

OM = 'Origin of the measure'


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
                items = zip([h.strip() for h in headers], line)
                item = dict(items)
                item['_id'] = get_id(item)
                data[line[index]].append(item)

    res = {}
    for index, items in data.items():
        res[index] = dict(zip([item['_id'] for item in items], items))

    return res


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
            items = zip([h.strip() for h in headers], line)
            item = dict(items)
            item['_id'] = get_id(item)
            data.append(item)

    return data


def fix_descriptor(rec):
    descriptors = [f'D{n}' for n in range(1, 12)]
    s = []
    for d in descriptors:
        if rec[d] == '1':
            s.append(d)
        del rec[d]
    rec['Descriptors'] = s


def fix_impacts(rec):
    s = []
    fields = [
        'IMPACTS Waste management', 'IMPACTS Air pollution',
        'IMPACTS Marine litter', 'IMPACTS NIS', 'IMPACTS Noise',
        'IMPACTS Pollution', 'IMPACTS Water pollution', 'IMPACTS Other'
    ]
    for f in fields:
        if f in rec:
            if rec[f] == '1':
                s.append(f.replace('IMPACTS ', ''))
            del rec[f]
    rec['Impacts'] = s


def fix_keywords(rec):
    s = []

    if 'Keywords' in rec:
        rec['Keywords'] = list(
            filter(None, [k.strip() for k in rec['Keywords'].split(',')]))
        return

    fields = [
        'accident management', 'administrative', 'air pollution',
        'anchoring/mooring', 'awareness raising', 'ballast waters',
        'construction', 'dredging', 'EU policies', 'hull fouling',
        'international agreements', 'legislation/regulation', 'maintenence',
        'marine litter', 'navigation', 'NIS', 'noise', 'pollution',
        'regional sea convention', 'PSSA/ZMES', 'technical measures',
        'waste management', 'water pollution'
    ]
    for f in fields:
        if f in rec:
            if rec[f] == '1':
                s.append(f)
            del rec[f]
    rec['Keywords'] = s


def get_id(rec):
    if rec.get('MeasureCode'):
        return rec['MeasureCode']
    if rec.get('CodeCatalogue'):
        return rec['CodeCatalogue']


def main():
    host = 'localhost'
    index = 'wise_catalogue_measures'

    conn = Elasticsearch([host])
    master_data = read_master_csv_files('./csv')

    data = read_details_csv_files('./csv')

    # cursors = defaultdict(lambda: 0)
    for (i, line) in enumerate(master_data):
        master_rec = master_data[i]
        measure_name = line[OM]
        rec = data[measure_name][master_rec['_id']]
        keys = master_rec.keys()
        for k, v in rec.items():
            for mk in keys:
                if k.lower().strip() == mk.lower().strip():
                    k = mk
            if k in master_rec \
                    and master_rec[k] \
                    and master_rec[k].lower() != v.lower():
                print(
                    f"Data conflict at position: : {i} ({master_rec['_id']})")
                print(f"Key: {k}. Conflicting sheet: {measure_name}.")
                print(f"Master value: {master_rec[k]}. Sheet value: {v}")
                print("")
                # import pdb
                # pdb.set_trace()
            master_rec[k] = v

        fix_descriptor(master_rec)
        fix_impacts(master_rec)
        fix_keywords(master_rec)

        # cursors[measure_name] += 1
        _id = get_id(master_rec)
        master_rec['_id'] = _id
        master_rec['_index'] = index

    ids = set([rec['_id'] for rec in master_data])
    print(len(ids))

    body = []
    for doc in master_data:
        body.append(json.dumps({"create": doc}))

    print(f"Indexing {len(master_data)} documents")
    num_docs = len(master_data)
    progress = tqdm.tqdm(unit="docs", total=num_docs)

    successes = 0

    for ok, action in streaming_bulk(
        client=conn, index=index, actions=iter(master_data),
    ):
        progress.update(1)
        successes += ok

    print("Indexed %d/%d documents" % (successes, num_docs))

    # jsonl = '\n'.join(body)
    # with open('out.jsonl', 'w') as f:
    #     f.write(jsonl)

    # import pdb
    # pdb.set_trace()
    # conn.bulk(jsonl, index=index)

    # for i, doc in enumerate(master_data):
    # conn.index(index="wise", id=uid, body=doc)
    # print(f"Index #{i}: {uid}")


if __name__ == "__main__":
    main()
