import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { notification } from 'antd';

export default class Paypal extends React.Component {
  render() {
    const onSuccess = (payment) => {
      // Congratulation, it came here means everything's fine!
      console.log('The payment was succeeded!', payment);

      // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
      this.props.onSuccess(payment);
    };

    const onCancel = (data) => {
      // User pressed "cancel" or close Paypal's popup!
      console.log('The payment was cancelled!', data);
      // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    };

    const onError = (err) => {
      // The main Paypal's script cannot be loaded or somethings block the loading of that script!
      console.log('Error!', err);
      // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
      // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    };

    let env = 'sandbox'; // you can set here to 'production' for production
    let currency = 'USD'; // or you can set this value from your props or state
    // let total = this.props.toPay; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
    let total = this.props.toPay; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
    // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

    // const client = {
    //     sandbox: 'AfvfVNKwLCT8aeL0LMbm7mQ6h05xiOx49XoxuSv1h0zld1YDGRuUQtWv2daO-YU9j2i1DfiJMKG3njXD',
    //     production: 'AT28vLU1uQWyvu4Rg9efmgSFjr6sfG9o5TmTpAi1_aVQLC3R3scPMxUhZiF064UAC0_NhC4YbSgcPCrt',
    // }

    const client = {
      sandbox:
        'ASIyD2VzblAbZa1SQBrJWEN-GmoU6jxBkF_Khmls0fskEoSb-6mL12BZ5SZNBLOBO6mtomDUc2jBHki7',
      production:
        'AV_DcXOR40sROj14PeI92SyR6bEql7rW9cXUDv3FvPEYl7NgZ2cEQ32icm9BLNJEUNi0M13zl9tu8s3e',
    };

    // In order to get production's app-ID, you will have to send your app to Paypal for approval first
    // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
    //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
    // For production app-ID:
    //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

    // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
    return (
      <PaypalExpressBtn
        env={env}
        client={client}
        currency={currency}
        total={total}
        shipping={1}
        onError={onError}
        onSuccess={onSuccess}
        onCancel={onCancel}
        style={{
          size: 'large',
          color: 'white',
          shape: 'rect',
          tagline: false,
        }}
      />
    );
  }
}
