import csv

from pkg_resources import resource_filename


def parse_csv(path, klass):
    wf = resource_filename('wise.theme', path)

    reader = csv.reader(open(wf))
    cols = reader.next()
    stats = []

    for line in reader:
        d = dict(zip(cols, line))
        s = klass(**d)
        stats.append(s)

    return stats
