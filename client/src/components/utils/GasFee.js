import React, { useEffect, useState } from "react";

function GasFee({
  addToMarket,
  enoughBalance,
  price,
  Fee,
  serviceFee,
  money,
  paypalFee,
  paypalFixedFeeUSD,
}) { 
  return (
    <p className="confirm-popup__text">
      Are you sure you'd like to{" "}
      {addToMarket === "adding"
        ? "add "
        : addToMarket === "removing"
        ? "remove "
        : "purchase "}      
      {addToMarket === "buying" || addToMarket === "removing" ? "from " : "to "}
      the marketplace? It costs gas fee.
      {enoughBalance ? (
        <p
          className="confirm-popup__text"
          style={{ textAlign: "right", marginRight: "30px" }}
        >
          {addToMarket === "buying" && 
            <>
              NFT Price:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(price).toFixed(2))}
              <br />
            </>
          }
          Gas Fee:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(Fee).toFixed(2))}
          <br />
          {addToMarket === "buying" ? ( 
            <>
              Service Fee:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(((Number(price) + Number(Fee)) * serviceFee).toFixed(2))}
            </>
          ) :
          (
            <>
              Service Fee:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format((Number(Fee) * serviceFee).toFixed(2))}              
            </>
          )}
         <br />
         {addToMarket === "buying" ? ( 
            <>
              Total:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                (
                  Number(price) +
                  Number(Fee) +
                  (Number(price) + Number(Fee)) * serviceFee
                ).toFixed(2)
              )} 
            </>
          ) :
          (
            <>
               Total:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format((Number(Fee) + Number(Fee) * serviceFee).toFixed(2))}
            </>
          )}            
          <br />
          <br />
          <hr />
          <br />
          Your Dbilia USD Balance:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(money)}
          <br />
          {addToMarket === "buying" ? ( 
            <>
              Balance After Purchase:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                Math.abs(money - (Number(price) + Number(Fee) + (Number(price) + Number(Fee)) * serviceFee)).toFixed(
                  2
                )
              )}         
            </>
          ) :
          (
            <>
              Balance After Purchase:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                Math.abs(money - (Number(Fee) + Number(Fee) * serviceFee)).toFixed(
                  2
                )
              )}         
            </>
          )}         
        </p>
      ) : (
        <p
          className="confirm-popup__text"
          style={{ textAlign: "right", marginRight: "30px" }}
        >
          {addToMarket === "buying" && 
            <>
              NFT Price:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(price).toFixed(2))}
              <br />
            </>
          } 
          Gas Fee:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Number(Fee).toFixed(2))}
          <br />
          {addToMarket === "buying" ? ( 
            <>
              Service Fee:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(((Number(price) + Number(Fee)) * serviceFee).toFixed(2))}
            </>
          ) :
          (
            <>
              Service Fee:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format((Number(Fee) * serviceFee).toFixed(2))}              
            </>
          )}
          <br />
          {addToMarket === "buying" ? ( 
            <>
              Paypal Fee:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(((Number(price) + Number(Fee)) * paypalFee + paypalFixedFeeUSD).toFixed(2))}            
            </>
          ) :
          (
            <>
              Paypal Fee:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format((Number(Fee) * paypalFee + paypalFixedFeeUSD).toFixed(2))}      
            </>
          )}          
          <br />
          {addToMarket === "buying" ? ( 
            <>
              Total:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                (
                  Number(price) +
                  Number(Fee) +
                  (Number(price) + Number(Fee)) * serviceFee +
                  (Number(price) + Number(Fee)) * paypalFee + paypalFixedFeeUSD
                ).toFixed(2)
              )} 
            </>
          ) :
          (
            <>
               Total:{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                (
                  Number(Fee) +
                  Number(Fee) * serviceFee +
                  Number(Fee) * paypalFee +
                  paypalFixedFeeUSD
                ).toFixed(2)
              )}
            </>
          )}    
          <br />
          <br />
          <hr />
          <br />
          Your Dbilia USD Balance:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(money)}
          <br />
          Balance After Purchase: $0.00
          <br />
          <span style={{ color: "red" }}>
            Please pay{" "}            
            {addToMarket === "buying" ? ( 
            <>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                (
                  Number(price) +
                  Number(Fee) +
                  (Number(price) + Number(Fee)) * serviceFee +
                  ((Number(price) + Number(Fee)) * paypalFee + paypalFixedFeeUSD) - money                  
                ).toFixed(2)
              )}{" "}
              more.
            </>
          ) :
          (
            <>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                (
                  Number(Fee) +
                  Number(Fee) * serviceFee +
                  (Number(Fee) * paypalFee + paypalFixedFeeUSD) -
                  money
                ).toFixed(2)
              )}{" "}
              more.
            </>
          )}    
          </span>
        </p>
      )}
    </p>
  );
}

export default GasFee;
