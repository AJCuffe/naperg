import React from 'react'
import Car from '../components/Car'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link} from 'react-router-dom'


class CarsPage extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      this.props.carsQuery.refetch()
    }
  }


  render() {

    if (this.props.carsQuery.error) {
      return (
        <div>Not authentificated</div>
      )
    }

    if (this.props.carsQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})</div>
        </div>
      )
    }

    return (
      <React.Fragment>
        <div className="flex justify-between items-center">
          <h1>Cars</h1>

          <Link
            to="car/create"
            className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
          >
            + Create Car
          </Link>
        </div>
        {this.props.carsQuery.cars &&
          this.props.carsQuery.cars.map(car => (
            <Car
              key={car.id}
              car={car}
              refresh={() => this.props.carsQuery.refetch()}
              isCar={!car.isPublished}
            />
          ))}
        {this.props.children}
      </React.Fragment>
    )
  }
}

const DRAFTS_QUERY = gql`
  query CarsQuery {
    cars {
      id
      name
    }
  }
`


export default graphql(DRAFTS_QUERY, {
  name: 'carsQuery', // name of the injected prop: this.props.feedQuery...
  options: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',

  },
})(CarsPage)
