<!DOCTYPE html>
<html>

<head>
 <meta charset="ISO-8859-1">
    <title>Factura comercial cagüita</title>
    <link rel="stylesheet" href="style.css" media="screen" />
</head>
<header class="clearfix">
<center>
<h1>FACTURA NO-FISCAL</h1>
<h4> 
V-016328118  <br> 

"COMERCIAL CAGÜITA", F.P.  <br> 
OTILIA SALAZAR <br> 
CALLE: FINAL CALLE EL ROSARIO <br>
CASA NRO S/N SECTOR EL GUAMACHE  <br>
CONTRIBUYENTE FORMAL </h4>
</center>

<div id="project">
<?php
echo '<div><span>FACTURA</span>'.$factura['id'].'</div>
      <div><span>CLIENTE</span>'.$factura['cliente']['name']. " ". $factura['cliente']['apellido'].'</div>
      <div><span>CEDULA</span>'.$factura['cliente']['cedula'].'</div>
      <div><span>DIRECCION</span>'.$factura['cliente']['direccion'].'</div>';
?>



</div>
</header>
      <table>
        <thead>
          <tr>
            <th class="desc">NOMBRE</th>
            <th>PRECIO</th>
            <th>CANTIDAD</th>
            <th>TOTAL</th>
          </tr>
        </thead>

<?php
 
 foreach ($factura->detalles as $factura->detalle) {
    echo '<tbody>
          <tr>
          <td class="desc">'.$factura->detalle['producto']['nombre'].'</td>
          <td class="unit">'.$factura->detalle['precio_venta'].'</td>
          <td class="qty">'.$factura->detalle['cant'].'</td>
          <td class="total">'.$factura->detalle['monto_total'].'</td>
          </tr>
          </tbody>';
}
?>
<!--aki debo meter el foreach pro de manera que recorra la tabla columna por columna-->
<?php
     echo '<tr>
            <td colspan="4">SUBTOTAL</td>
            <td class="total">'.$factura['monto_total'].'</td>
          </tr>
          <tr>
            <td colspan="4">Descuento%</td>
            <td class="total">0%</td>
          </tr>
          <tr>
            <td colspan="4" class="grand total">MONTO TOTAL</td>
            <td class="grand total">'.$factura['monto_total'].'</td>';
?>
      </table>

      <h4>ABONOS</h4>
      <table>
        <thead>
          <tr>
            <th class="desc">TIPO</th>
            <th>MONTO</th>
            <th>FECHA-HORA</th>
          </tr>
        </thead>
<?php
 
 foreach ($factura->pagos as $factura->pago) {
    echo '<tbody>
          <tr>
          <td class="desc">'.$factura->pago['tipo'].'</td>
          <td class="unit">'.$factura->pago['monto'].'</td>
          <td class="qty">'.$factura->pago['created_at'].'</td>
          </tr>
          </tbody>';
       
  
}
?>
</table>
</html>