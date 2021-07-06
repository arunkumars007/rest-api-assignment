// custom javascript
var functionsList = [];
(function() {
  $.ajax({
    type: 'GET',
    url: '/all_operations',
    headers: {
      'Content-Type': 'application/json',
    },
    success: function (response) {
      console.log(response);
      for(i=0;i< response.data.length;i++){
        functionsList.push(response.data[i].function_name);
        const html = `
          <tr>
            <td>${i+1}</td>
            <td>${response.data[i].function_name}</td>
            <td><button type="submit" class="btn btn-primary mb-2" onclick="handleDelete(event, ${response.data[i].id})">Delete</button></td>
          </tr>`;
        const newRow = document.getElementById('tData').insertRow(-1);
        newRow.innerHTML = html;
      }
      console.log(functionsList);
      const selElement = document.getElementById('sel2');
      for(i=0;i< functionsList.length;i++){
        var opt = document.createElement('option');
        opt.innerHTML = functionsList[i];
        selElement.appendChild(opt);
      }

      var defaultSel = $("#sel2 option:selected").text();
      if(['Square Root', 'Cube Root'].includes(defaultSel)){
        $("#y-val").prop('disabled', true);
      }else{
        $("#y-val").prop('disabled', false);
      }
    }
  });

})();

function handleOperation(event) {
  event.preventDefault();

  var funType = $("#sel2 option:selected").text();
  var x = $('#x-val').val();
  var y = $('#y-val').val();
  $.ajax({
    type: 'POST',
    url: `/perform_function`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({type: funType, x: x, y: y}),
    success: function (response) {
      if(x && y){
        alert(funType + " of " + x + ", " + y + " is " + response.result);
      }else if(x && !y){
        alert(funType + " of " + x + " is " + response.result);
      }
    }
  });
}

function handleInsert(e){
  e.preventDefault();
  //submit the form
  var funType = $("#sel1 option:selected").text();
  $.ajax({
    type: 'POST',
    url: '/all_operations',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({ type: funType }),
    success: function (response) {
      alert("Function added successfully...")
      location.reload();
    }
  });
}

function handleDelete(event, type_id) {
  event.preventDefault();
  if (confirm('Are you sure you want to delete the function?')) {
    $.ajax({
      type: 'DELETE',
      url: `/function/${type_id}`,
      headers: {
        'Content-Type': 'application/json',
      },
      success: function (response) {
        alert("Function deleted successfully...");
        location.reload();
      },
      error: function (error) {
        alert("Please try again later...")
      }
    });
  } else {
    alert("Function deletion event got cancelled...")
  }
}

$("#sel2").on('change', function(e){
  if(['Square Root', 'Cube Root'].includes(this.value)){
    $("#y-val").prop('disabled', true);
  }else{
    $("#y-val").prop('disabled', false);
  }
});