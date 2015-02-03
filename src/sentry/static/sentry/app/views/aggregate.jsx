/*** @jsx React.DOM */

var React = require("react");
var Reflux = require("reflux");
var Router = require("react-router");

var api = require("../api");
var AggregateHeader = require("./aggregate/header");
var AggregateListStore = require("../stores/aggregateListStore");
var utils = require("../utils");

var AggregateDetails = React.createClass({
  mixins: [
    Reflux.connect(AggregateListStore, "aggList"),
    Router.State
  ],

  propTypes: {
    memberList: React.PropTypes.instanceOf(Array).isRequired
  },

  getInitialState: function() {
    return {
      aggList: new utils.Collection(),
      statsPeriod: '24h'
    };
  },

  componentWillMount: function() {
    api.request(this.getAggregateDetailsEndpoint(), {
      success: function(data, textStatus, jqXHR) {
        AggregateListStore.loadInitialData([data]);
      }.bind(this)
    });
  },

  getAggregateDetailsEndpoint: function() {
    return '/groups/' + this.getParams().aggregateId + '/';
  },

  getAggregate: function() {
    var id = this.getParams().aggregateId;
    // TODO(dcramer): 99% certain someone will say this is inappropriate
    return AggregateListStore.getItem(id);
  },

  render: function() {
    var aggregate = this.getAggregate();

    if (!aggregate) {
      return <div />;
    }

    return (
      <div className={this.props.className}>
        <AggregateHeader
            aggregate={aggregate}
            statsPeriod={this.state.statsPeriod}
            memberList={this.props.memberList} />
        <Router.RouteHandler
            memberList={this.props.memberList}
            aggregate={aggregate}
            statsPeriod={this.state.statsPeriod} />
      </div>
    );
  }
});

module.exports = AggregateDetails;