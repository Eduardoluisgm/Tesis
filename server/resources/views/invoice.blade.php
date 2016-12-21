<!DOCTYPE html>
<html>

<head>
 <meta charset="ISO-8859-1">
    <title>Factura comercial cagüita</title>
    <link rel="stylesheet" href="style.css" media="screen" />
</head>
<header class="clearfix">
<center>
<h1>SENIAT</h1>
<h4> 
V-016328118  <br> 
COMERCIAL CAGÜITA, F.P.  <br> 
OTILIA SALAZAR <br> 
CALLE: FINAL CALLE EL ROSARIO <br>
CASA NRO S/N SECTOR EL GUAMACHE  <br>
CONTRIBUYENTE FORMAL </h4>
</center>

<div id="project">
<?php
echo '<div><span>CEDULA</span>'.$factura['client_id'].'</div>
      <div><span>CLIENTE</span>'.$factura['client_id'].'</div>';
?>

  <!--  <div><span>CEDULA</span>655655656</div>
        <div><span>CLIENTE</span>ANDERSON</div>
        <div><span>DIRECCION:</span>EL GUAMACHE</div>
        <div><span>VENDEDOR</span>01</div>
        <div><span>FECHA</span>01 DE DICIEMBRE DEL 2016</div> -->
      
</div>
</header>
      <table>
        <thead>
          <tr>
            <th class="service">CODIGO</th>
            <th class="desc">NOMBRE</th>
            <th>PRECIO</th>
            <th>CANTIDAD</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="service">01</td>
            <td class="desc">CACIQUE AÑEJO</td>
            <td class="unit">5,000.00</td>
            <td class="qty">12</td>
            <td class="total">60,000.00</td>
          </tr>
          <tr>
            <td class="service">02</td>
            <td class="desc">HIELO</td>
            <td class="unit">1,300.00</td>
            <td class="qty">2</td>
            <td class="total">2,600.00</td>
          </tr>
          
          <tr>
            <td colspan="4">SUBTOTAL</td>
            <td class="total">62,600.00</td>
          </tr>
          <tr>
            <td colspan="4">Descuento%</td>
            <td class="total">0%</td>
          </tr>
          <tr>
            <td colspan="4" class="grand total">MONTO TOTAL</td>
            <td class="grand total">62,600.00</td>
          </tr>
        </tbody>
      </table>
      <div id="notices">
        <div>NOTICIA:</div>
        <div class="notice">LOS PRODUCTOS NO PUEDEN SER DEVUELTOS UNA VEZ EMITIDA LA FACTURA.</div>
      </div>
</html>