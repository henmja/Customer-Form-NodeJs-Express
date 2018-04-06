//execute function deleteCustomer when one of the .deleteCustomer classes are clicked...
$(document).ready(function(){
	$('.deleteCustomer').on('click', deleteCustomer);	
});
//navigate to /delete/'id of given button' which fires of the app.delete function in app.js...
function deleteCustomer(){
		$.ajax({
			type:'DELETE',
			url: '/delete/'+$(this).data('id')
		}).done(function(response){
			window.location.replace('/');
		});
		window.location.replace('/');
		return false
}