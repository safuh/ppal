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
    createSubscription: function(data, actions) {
      return actions.subscription.create({
        /* Creates the subscription */
        plan_id: 'P-40J68497JD854125YMROAWYA'
      });
    },
    onApprove:async  function(data, actions) {
      const email = JSON.parse(document.getElementById('email').textContent);
      const ans= {
        email:email,
        package:1,
        amt:6,
      };
      const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      const response = await fetch('/orders/capture', {
        method :'POST',
        headers: {'X-CSRFToken': csrftoken},
        mode:'same-origin',
        body : JSON.stringify(ans),
      });
      const details = await response.json();
      document.getElementById('keydiv').className = "row d-block";
      document.getElementById('devprice').className="row d-none";
      document.getElementById('keytext').innerHTML = details.api_key;
      location.href='#keytext';
      //alert(data.subscriptionID); // You can add optional success message for the subscriber here
    }
  }).render('#paypal-button-container-P-40J68497JD854125YMROAWYA'); })