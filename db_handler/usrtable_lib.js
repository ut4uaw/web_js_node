var gtable; // global table variable
var GDATA;

function loadUserTable(tablename){
	 $.ajax({
		type: "GET",
		url: "/getdb?tablename="+tablename,
		success: function(data){
			GDATA=data;
			

			CreateHTMLTableView(data, tablename, 'usertable',true)
			createUserTable(data, tablename);

		}
	});
}

function createUserTable(xdata, tablename){

		$('#'+tablename+' tfoot th').each( function () {
			var self = $(this);
			var title = $('#'+tablename+' thead th').eq( self.index() ).text();
			self.html( '<input type="text" placeholder="Search '+title+'" />' );
		});
		  
				// Initialise the DataTable
	    table = $('#'+tablename).DataTable( {
				//lengthChange: false
			} );

		gtable = table;
		// Apply the filter
		table.columns().eq( 0 ).each( function ( colIdx ) {
			$( 'input', table.column( colIdx ).footer() ).on( 'keyup change', function () {
				//if (colIdx != 0 ) {
				 table
					.column( colIdx )
					.search( this.value )
					.draw();
				//}
			});
			//$( 'a').on('click',function(obj) {
			//	console.log('Pressed<a>', obj);
/*
				 table
					//.column( colIdx )
					//.search( this.value )
					.draw();*/
			//});
		});
		
		var tableTools = new $.fn.dataTable.TableTools( table, {
        sRowSelect: "os",
        aButtons: [
        ]
		} );
		$( tableTools.fnContainer() ).insertBefore( '#'+tablename );
		//table.order( [ 1, 'asc' ], [ 2, 'asc' ] ).draw();
		//new $.fn.dataTable.FixedColumns( table );
		
		$('#'+tablename+' tbody').on( 'click', 'tr', function () {
    		console.log( 'Row index: '+table.row( this ).index() );
		} );

		/*  **** Work with table events **** */
		$('td').on('click',function() {
               // var col = $(this).parent().children().index($(this));
               // var row = $(this).parent().parent().children().index($(this).parent());
                //console.log('Row: ' + row + ', Column: ' + col);
                if (!document.getElementsByClassName('DTTT_selected').item('td')) {
					$('#Edit_button').removeClass("DTTT_disabled");
					$('#Delete_button').removeClass("DTTT_disabled");
					// console.log('DTTT_selected');
				} else {
					$('#Edit_button').addClass("DTTT_disabled");
					$('#Delete_button').addClass("DTTT_disabled");
					// console.log('DTTT_UNselected');
				}
                
                
        });
    
}

function CreateHTMLTableView(objArray, tablename, contentTarget, enableHeader) {

    // If the returned data is an object do nothing, else try to parse
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	
	//console.log('test '+array);
    var str = '<div class="container"><table id="'+tablename+'" cellspacing="0" width="100%">';
     
    // table head
   // if (enableHeader) {
        str += '<thead><tr>';
        for (var index in array[0]) {
			if (index != 'DT_RowId' )
				str += '<th>' + index + '</th>';
			else
				str += '';//'<th class="myEdit">Select</th>';
        }
        str += '</tr></thead>';
    //}
    
    // table foot
    //if (enableHeader) {
        str += '<tfoot><tr>';
        for (var index in array[0]) {
            if (index != 'DT_RowId' )
				str += '<th>' + index + '</th>';
			else
				str += '';//'<th></th>';
        }
        str += '</tr></tfoot>';
    //}
     
    // table body
    str += '<tbody>';
    for (var i = 0; i < array.length; i++) {
        //str += (i % 2 == 0) ? '<tr id="row_'+ array[i].DT_RowId +'">' : '<tr id="row_'+ array[i].DT_RowId +'">';
        str +='<tr id_rec="'+ array[i].DT_RowId +'">';
        for (var index in array[i]) {
			if (index != 'DT_RowId' ) //console.log("id= "+array[i].DT_RowId);
				str += '<td>' + array[i][index] + '</td>';
            else
				str +='';
        }
        str += '</tr>';
    }
    str += '</tbody>';
    str += '</table></div>';

    $('#'+contentTarget).append(str);
}

function new_onclick(clicked)
{
	var tablename = $( 'table' ).attr('id');
	var newData = ["AM", "3", "0", "120", "127", "0", "0", "2412", "2472"];
	
	var labelData = selectedRowFromTable( tablename, false );
	edit_form_creator(labelData, tablename, false);
	
}

function edit_onclick(clicked)
{
	var tablename = $( 'table' ).attr('id');

	if (document.getElementsByClassName('DTTT_selected').item('td')) {
		var selectData = selectedRowFromTable( tablename, true );
		edit_form_creator(selectData, tablename, true);	
	}
}

function edit_form_creator(selectData, tablename, edited) {
	var convData = serializeLocalObject($.parseJSON(selectData));
	var objArray = [];
	objArray[0] = JSON.parse(convData);
	console.log('DT_RowId TABLE: '+tablename);

	//<!-- editor form -->
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	var str = '<div id="abc" onClick="check(event, \'abc\')"><div class="popupContainer">';

	for (var i = 0; i < array.length; i++) {
		str += '<form id="edit" class="form-container" tablename="'+tablename+'" id_rec="'+array[0].DT_RowId+'"><b>Edit form:</b></br>';
		//str += (i % 2 == 0) ? '<tr id='+array[i].DT_RowId+'>' : '<tr id='+array[i].DT_RowId+'>';
		for (var index in array[i]) {
			console.log(index, ' : ', array[i][index]);
			switch(index) {
				case 'DT_RowId':
					//DO NOTHING
					break;
				default:
					str += '<label for="'+index+'">'+index.replace("</br>","")+': </label>'
					str += '<input type="text" name="'+index+'" value="'+array[i][index]+'">';
			}
		}
		if(edited)
			str += '</br><button class="DTTT_button" id="submit" onClick="confirmSubmitFormData()">Submit</button></form>';
		else
			str += '</br><button class="DTTT_button" id="submit" onClick="confirmCreateFormData()">Create</button></form>';
	}

	str += '<div class="fancybox-close popupContainer" id="close"> </div></div></div>';
	$("#edit").on("click",function(event){
		var 
				self = $(this),
				id = self.attr('id_rec')
			;
	  console.log("The paragraph was clicked. id="+id);

	  
	});
	popup_show($('#usertable'), str, 'abc');
}

function delete_onclick(clicked)
{
	var tablename = $( 'table' ).attr('id');

	if (document.getElementsByClassName('DTTT_selected').item('td')) {
		var id = $('#'+tablename).find('tr.DTTT_selected').find('td')[0].parentNode.getAttribute("id_rec");
		deleteData(id, tablename);
	}
}

function selectedRowFromTable(tablename, selected) {
	var valuelist = [];
	
    cells_count = document.getElementsByTagName('thead').item('tr').children[0].children.length;
    
	if (selected)
		valuelist[0] = {
					name : "DT_RowId",
					value: $('#'+tablename).find('tr.DTTT_selected').find('td')[0].parentNode.getAttribute("id_rec")
				};
	else
		valuelist[0] = {
				name : "DT_RowId",
				value: 'new'
			};

	
	for (var i=1; i<=cells_count; i++) 
	{
		if (selected)
			valuelist[i] = {
				name : document.getElementsByTagName('table').namedItem(tablename).rows[0].cells[i-1].textContent,
				value: $('#'+tablename).find('tr.DTTT_selected').find('td')[i-1].textContent
				};
		else
			valuelist[i] = {
				name : document.getElementsByTagName('table').namedItem(tablename).rows[0].cells[i-1].textContent,
				value: ""
				};
			
	}
	
	return JSON.stringify(valuelist);
}

function confirmSubmitFormData()
{
	var str = $( "form" ).serializeObject();
	var id = $( "form" ).attr('id_rec');
	var tablename = $( "form" ).attr('tablename');
	updateData(id, str, tablename);
}

function updateData(id, objArr, tablename)
{
	var agree=confirm("Are you sure you wish to continue?");

	if (agree) {
		updateSelectedRow(id, objArr, tablename);
		$.extend(objArr, {DT_RowId: id});
		//console.log('objArr ', objArr);
		$.ajax({
			url : "/update?tablename="+tablename,
			type: "POST",
			data : objArr,
			success: function(data, textStatus, jqXHR)
			{
				//data - response from server
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
	}
}

function confirmCreateFormData()
{
	var str = $( "form" ).serializeObject();
	var id = $( "form" ).attr('id_rec');
	var tablename = $( "form" ).attr('tablename');
	createData(id, str, tablename);
}

function createData(id, objArr, tablename)
{
	var agree=confirm("Are you sure you wish to continue?");

	if (agree) {
		//updateSelectedRow(id, objArr, tablename);
		$.extend(objArr, {DT_RowId: id});
		//console.log('objArr ', objArr);
		$.ajax({
			url : "/create?tablename="+tablename,
			type: "POST",
			data : objArr,
			success: function(data, textStatus, jqXHR)
			{
				var newData = [];
				var cells_count = document.getElementsByTagName('thead').item('tr').children[0].children.length;
				var array = typeof data != 'object' ? JSON.parse(data) : data;
				//console.log('data - response from server: ', data);
				//console.log('data.insertId - response from server: ', array.insertId);
				//id = array.insertId;
				objArr.DT_RowId = array.insertId;
        		var str ='<tr id_rec="'+ objArr.DT_RowId +'">';

				for (var i=0; i<cells_count; i++) {
					var nameCell = document.getElementsByTagName('thead').item('tr').children[0].children[i].textContent;
					//if (index != 'DT_RowId' ) //console.log("id= "+array[i].DT_RowId);
						str += '<td>' + objArr[nameCell] + '</td>';
						newData[i]=objArr[nameCell];
		            //else
					//	str +='';
					//console.log(nameCell,":", objArr[nameCell]);
				}
		        str += '</tr>';
				console.log('Str: ', str);

				//gtable.$('#tbody').add(str);
				//gtable.row.data( ["0AM", "3", "0", "120", "127", "0", "0", "2412", "2472"] ).draw();
				console.log('newData updated in TABLE: '+newData);
				var rowNode = table
				    .row.add( newData )
				    .draw()
				    .node();
				 
				$( rowNode )
				    .css( 'color', 'red' )
				    .animate( { color: 'black' } );

				//data - response from server
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
	}
}

function deleteData(id, tablename)
{
	var agree=confirm("Are you sure you wish to continue?");

	if (agree) {

		$.ajax({
			url : "/delete?tablename="+tablename,
			type: "POST",
			data : {DT_RowId: id},
			success: function(data, textStatus, jqXHR)
			{
				gtable.$('tr.DTTT_selected').remove();
				
				//data - response from server
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
		 
			}
		});
		//var rowtoremove=document.getElementsByClassName('DTTT_selected').item('tr');
		//console.log('gtable.draw'+rowtoremove);
	
		
	}
}


function updateSelectedRow(id, array, tablename) {
	var i = 0;
	for (var index in array) { 
		document.getElementsByClassName('DTTT_selected').item('tr').children[i].textContent = array[index];
		i++;
	}
};

/* ************* POPUP ************* */

//function to display Popup
function popup_show(cont, str, id){
	cont.append(str);
	document.getElementById(id).style.display = "block";
}
 
//function to check target element
function check(e, id){
	var target = (e && e.target) || (event && event.srcElement); 
	var obj = document.getElementById(id);
	 
	checkParent(target, id)?obj.style.display='none':null;
} 
 
//function to check parent node and return result accordingly
function checkParent(t, id){
	 while(t.parentNode){
		if(t==document.getElementById(id))
		{
			return false
		}
		else if(t==document.getElementById('close'))
		{
			document.getElementById(id).remove();
			return true
		}
		else if(t==document.getElementById('submit'))
		{
			document.getElementById(id).remove();
			return true
		}
		t=t.parentNode
	 }
	 //console.log('end checkParent');
	 return true
}


/* **** converter JSON to name:value pair **** */
function serializeLocalObject(array) {
	var result = {};
	
	$.each(array, function(i, val) {
		result[val.name] = val.value;
	});
	
	return JSON.stringify(result);
};