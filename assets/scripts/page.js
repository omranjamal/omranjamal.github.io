$(function () {
    $('.burger').click(function () {
        $(this).parent().parent().toggleClass('open');
    });
});
