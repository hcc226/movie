$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);
        console.log(target)
        var id = target.data('id');
        console.log(id)
        var tr = $('.item-id-'+id);
        console.log(tr)
        $.ajax({
            type:'DELETE',
            url:'/admin/list?id=' + id
        })
            .done(function (results) {
                if(results.success ===1){
                    if(tr.length>0){
                        tr.remove();
                    }
                }
            })
    })

})