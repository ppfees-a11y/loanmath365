const $=id=>document.getElementById(id);
const money=n=>n.toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});
function basePayment(P,annual,n){
  if(annual===0)return P/n;
  const r=annual/100/12;
  return P*r/(1-Math.pow(1+r,-n));
}
function payoff(P,annual,payment){
  const r=annual/100/12;
  let bal=P, interest=0, months=0;
  while(bal>0.005 && months<12000){
    let i=bal*r;
    let principal=payment-i;
    if(principal<=0)return null;
    if(principal>bal) principal=bal;
    interest+=i; bal-=principal; months++;
  }
  return {interest,months};
}
function timeText(m){
  const y=Math.floor(m/12), mo=m%12;
  if(y&&mo)return `${y} yr ${mo} mo`;
  if(y)return `${y} yr`;
  return `${mo} mo`;
}
function calculate(){
  const P=parseFloat($("amount").value), annual=parseFloat($("rate").value), years=parseFloat($("years").value), extra=parseFloat($("extra").value)||0;
  $("error").textContent="";
  if(!(P>0)||annual<0||!(years>0)||extra<0){$("error").textContent="Please enter valid positive loan values.";return;}
  const n=Math.round(years*12), pay=basePayment(P,annual,n), total=pay*n, interest=total-P;
  $("payment").textContent=money(pay); $("interest").textContent=money(interest); $("total").textContent=money(total); $("months").textContent=n+" months";
  if(extra>0){
    const x=payoff(P,annual,pay+extra);
    if(x){
      $("extraBox").hidden=false;
      $("extraTime").textContent=timeText(x.months);
      $("extraInterest").textContent=money(x.interest);
      $("saved").textContent=money(Math.max(0,interest-x.interest));
      $("timeSaved").textContent=timeText(Math.max(0,n-x.months));
    }
  } else $("extraBox").hidden=true;
}
$("calc").addEventListener("click",calculate);calculate();