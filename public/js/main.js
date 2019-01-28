$(document).ready(function(){
$(".delete-article").on('click',function(e){
//let id=e.target.getAttribute('data-id') will work as well.
let id=$(e.target).attr("data-id");
//alert(id);
//submitting a delete request
$.ajax({
type:"DELETE",
url:"/articles/"+id,
success:function(response){
  alert("Deleting Article");
  window.location.href="/";
},
error:function(err){
  console.log(err);
}
});
});
});
