function exec_cmd()
{
  $.get('/exec_cmd', { cmd : $('#command').val(),
    imagePath : $('#imagePath').val(),
  toolPath : $('#toolPath').val()})
    .done(function(data) {
      $('#output').val(data);
    });
}

function get_images()
{
  $.get('/get_images', null)
    .done(function(res)
        {
          $('#output').val(res.output);
          var all_imgs = res.imgs;
          $('#img_list').empty();
          for(var i = 0; i < all_imgs.length; i++)
    {
      var opt = document.createElement("option");
      opt.text = all_imgs[i];
      opt.value = all_imgs[i];
      $('#img_list').append(opt);
    }
        });
}

function select_image()
{
  $.get('/select_image', { img_name : $('#img_list').val() })
    .done(function(res)
        {
          if(res.success)
      alert("Yay success!");
          else
      alert("Boo failure!");
        });
}

function load_db()
{
  $.get('/load_db', null)
    .done(function(res)
        {
          if(res.success)
    {
      alert("Yay success!");
    }
          else
      alert("Boo failure!");
        });
}

function list_files()
{
  $.get('/list_files', null)
    .done(function(res)
        {
          if(res.success)
    {
      alert("Yay success!");
      $('#output').val(res.file_list);
    }
          else
      alert("Boo failure!");
        });
}

$(function(){

  $('#submit').click(exec_cmd);

  $('#clear').click(function() {
    $('#output').val('');
  });

  $('#command').keyup(function(event) {
    if (event.keyCode == 13) {
      $('#submit').click();
    }
  })

  $('#get_imgs').click(get_images);

  $('#select_img').click(select_image);


});
