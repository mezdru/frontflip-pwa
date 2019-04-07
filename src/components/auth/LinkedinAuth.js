import React from 'react'
import LinkedinSDK from 'react-linkedin-sdk'
 
class LinkedinAuth extends React.Component {
  responseLinkedin = (response) => {
    console.log(response)
  }
 
  render() {
    return (
      <LinkedinSDK
        clientId="123456789010"
        callBack={this.responseLinkedin}
        fields=":(id,num-connections,picture-urls::(original))"
        className={'className'}
        loginButtonText={'Login with Linkedin'}
        logoutButtonText={'Logout from Linkedin'}
        buttonType={'button'}
        getOAuthToken
      />
    )
  }
}
 
export default LinkedinAuth