import React from 'react';
import { runRequest } from '@eeacms/search';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { Grid, Table } from 'semantic-ui-react'; // , Segment

const REQUEST = {
  size: 0,
  aggs: {
    Descriptors: {
      terms: {
        field: 'Descriptors',
      },
    },
    Sectors: {
      terms: {
        field: 'Sector',
      },
    },
    MeasureImpacts: {
      terms: {
        field: 'Measure Impacts to',
      },
    },
    Origin: {
      terms: {
        field: 'Origin of the measure',
      },
    },
    OriginByDescriptor: {
      terms: {
        field: 'Descriptors',
      },
      aggs: {
        Origin: {
          terms: {
            field: 'Origin of the measure',
          },
        },
      },
    },
  },
};

const getMeasureImpacts = (data) => {
  return data.MeasureImpacts.buckets.map(({ key, doc_count }) => ({
    id: key,
    label: key,
    value: doc_count,
  }));
};

const getOriginOfMeasure = (data) => {
  return data.Origin.buckets.map(({ key, doc_count }) => ({
    id: key,
    label: key,
    value: doc_count,
  }));
};

const getSectors = (data) => {
  return data.Sectors.buckets.map(({ key, doc_count }) => ({
    id: key,
    label: key,
    value: doc_count,
  }));
};

const getBarChartData = (data) => {
  return data.OriginByDescriptor.buckets.map(({ key, doc_count, Origin }) => ({
    Descriptor: key,
    ...Object.assign(
      {},
      ...Origin.buckets.map(({ key, doc_count }) => ({ [key]: doc_count })),
    ),
  }));
};

const OriginTable = ({ columns, rows, data }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Origin of measure</Table.HeaderCell>
          {columns.map((col) => (
            <Table.HeaderCell key={col}>{col}</Table.HeaderCell>
          ))}
        </Table.Row>
        {rows.map((origin) => (
          <Table.Row key={origin}>
            <Table.HeaderCell>{origin}</Table.HeaderCell>
            {columns.map((descriptor, i) => (
              <Table.Cell key={`${i}-${descriptor}`}>
                {data[i][origin]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
        <Table.Row>
          <Table.HeaderCell>Total</Table.HeaderCell>
          {data.map((item) => (
            <Table.Cell key={item.Descriptor}>
              {rows
                .map((r) => parseInt(item[r]) || 0)
                .reduce((a, b) => a + b, 0)}
            </Table.Cell>
          ))}
        </Table.Row>
      </Table.Header>
    </Table>
  );
};

const ChartsIntro = (props) => {
  const { appConfig } = props;
  const [chartData, setChartData] = React.useState();

  React.useEffect(() => {
    let alreadyRequested = false;

    async function fetchData() {
      const resp = await runRequest(REQUEST, appConfig);
      if (!alreadyRequested) setChartData(resp.body?.aggregations);
    }
    fetchData();
    return () => {
      alreadyRequested = true;
    };
  }, [appConfig]);

  const barData = (chartData ? getBarChartData(chartData) : []).sort((a, b) =>
    parseInt(a.Descriptor.slice(1)) > parseInt(b.Descriptor.slice(1)) ? 1 : -1,
  );
  // console.log('all', chartData);
  console.log('barData', barData);

  return (
    <div className="charts-intro-page">
      {chartData ? (
        <>
          <Grid columns="3" stackable>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={8}>
                <div style={{ height: '400px' }}>
                  <h3>Measure impacts to</h3>
                  <PieChart data={getMeasureImpacts(chartData)} />
                </div>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={16} computer={8}>
                <div style={{ height: '400px' }}>
                  <h3>Origin of the measure</h3>
                  <PieChart data={getOriginOfMeasure(chartData)} />
                </div>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={16} computer={8}>
                <div style={{ height: '400px' }}>
                  <h3>Sectors</h3>
                  <PieChart data={getSectors(chartData)} />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div style={{ height: '600px' }}>
            <h3>Origin of the measure/Descriptors</h3>
            <BarChart
              data={barData}
              keys={Object.keys(barData[1] || {}) // [0] doesn't have all keys
                .filter((k) => k !== 'Descriptor')
                .sort()}
              indexBy="Descriptor"
            />
          </div>
          <OriginTable
            data={barData}
            columns={barData.map(({ Descriptor }) => Descriptor)}
            rows={Object.keys(barData[1] || {})
              .filter((k) => k !== 'Descriptor')
              .sort()}
          />
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default ChartsIntro;
