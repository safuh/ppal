const FUNDING_SOURCES = [
paypal.FUNDING.PAYPAL,
paypal.FUNDING.CARD
];

FUNDING_SOURCES.forEach(fundingSource => {
  paypal.Buttons({
    fundingSource,
    style: {
      shape: 'pill',
      color: (fundingSource==paypal.FUNDING.PAYLATER) ? 'gold' : '',
      layout: 'vertical',
      label: 'subscribe'
    },
    /*createOrder:async function(data,actions){
      const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      console.log('hello');
      const ans={amt:'24'};
      const response =  await fetch('/orders',{
        method:'POST',
        headers: {'X-CSRFToken': csrftoken},
        mode:'same-origin',
        body:JSON.stringify(ans),
      });
      console.log('hello world');
      const details = await response.json();
      console.log(details);
      return details.id
    },*/
    createSubscription: function(data, actions) {
      return actions.subscription.create({
        /* Creates the subscription */
        plan_id: 'P-3SM16664RN621261TMROBFPY'
      });
    },
    onApprove:async  function(data, actions) {
      const email = JSON.parse(document.getElementById('email').textContent);
      const ans= {
        email:email,
        package:3,
        //orderID:data.orderID,
        amt:24,
      };
      const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      const response = await fetch('/orders/capture', {
        method :'POST',
        headers: {'X-CSRFToken': csrftoken},
        mode:'same-origin',
        body : JSON.stringify(ans),
      });
      //console.log(response.json());
      const details = await response.json();
      console.log(details);
      document.getElementById('keydiv').className = "row d-block";
      document.getElementById('devprice').className="row d-none";
      document.getElementById('keytext').innerHTML = details.api_key;
      location.href='#keytext';

      /*const errdetail=Array.isArray(details.details) && details.details[0];
      if(errdetail && errdetail.issue === 'INSTRUMENT_DECLINED'){
        return actions.restart();
      }
      if(errdetail){
        let msg='sorry your transaction could not be processed';
        if(errdetail.description) msg += '\n\n'+errdetail.description;
        if (details.debug_id) msg += ' (' + details.debug_id + ')';
        return alert(msg);
      }
      console.log('Capture result', details, JSON.stringify(details, null, 2));
      const transaction = details.purchase_units[0].payments.captures[0];
      alert('Transaction '+ transaction.status + ': ' + transaction.id + '\n\nSee console for all available details');
      alert(data.subscriptionID); // You can add optional success message for the subscriber here*/
    }
  }).render('#paypal-button-container-P-3SM16664RN621261TMROBFPY'); })//-P-3SM16664RN621261TMROBFPY