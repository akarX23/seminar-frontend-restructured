import React, { Component } from "react";
import { connect } from "react-redux";
import { auth } from "../actions/user_actions";
import { bindActionCreators } from "redux";
import AuthRevoked from "../Components/AuthRevoked/authRevoked";
import Loading from "../WidgetsUI/Loading/loading";
import { userTypes } from "../helpers/utils";
import Layout from "./layout";

export default (ComposedClass, authUser) => {
  class AuthenticationCheck extends Component {
    state = {
      loading: true,
      authRevoke: false,
    };

    componentDidMount() {
      this.props.auth();
    }

    componentWillReceiveProps(nextProps) {
      this.setState({ loading: false });
      const { details, type } = nextProps.user;

      if ((!details && authUser) || (details && authUser === false))
        this.props.history.push("/");
      else if (authUser && type !== userTypes[authUser.toUpperCase()]) {
        this.setState({ authRevoke: true });
      }
    }

    render() {
      if (this.state.loading) return <Loading />;
      if (this.state.authRevoke) return <AuthRevoked />;

      return (
        <Layout>
          <ComposedClass
            user={this.props.user.user}
            history={this.props.history}
            queries={this.props.match.params}
            {...this.props}
          />
        </Layout>
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };

  const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({ auth }, dispatch),
  });

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticationCheck);
};
