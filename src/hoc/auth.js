import React, { Component } from "react";
import { connect } from "react-redux";
import { auth } from "../actions/user_actions";
import { bindActionCreators } from "redux";
import AuthRevoked from "../Components/AuthRevoked/authRevoked";
import Loading from "../WidgetsUI/Loading/loading";
import { userTypes } from "../helpers/utils";
import Layout from "./layout";

export default (ComposedClass, authUsers = null) => {
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

      // authUsers => true, false, array of user types. null
      console.log(details);
      if (details && authUsers === false) this.props.history.push("/");
      else if (
        !details &&
        authUsers !== null &&
        (authUsers === true || authUsers.length > 0)
      ) {
        this.setState({ authRevoke: true });
      } else if (details && authUsers?.length && !authUsers.includes(type))
        this.setState({ authRevoke: true });
    }

    render() {
      if (this.state.loading) return <Loading fullPage />;
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
