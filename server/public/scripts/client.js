$( document ).ready( readyNow );

function readyNow(){
    console.log( 'JQ' );
    $('#addSongButton').on('click', addSong);
    getSongs();
} // end readynow

function addSong() {
    console.log('in addSong');
    //get user input
    //package in an object
    
    const objectToSend = {
        artist: $('#artistIn').val(),
        published: $('#publishedIn').val(),
        rank: $('#rankIn').val(),
        track: $('#trackIn').val()
    }//end objectToSend
    console.log('sending:', objectToSend );
    //send to server via AJAX
    $.ajax({
        method: 'POST',
        url: '/songs',
        data: objectToSend
    }).then( function(response){
        console.log('back from POST with:', response);
        
    }).catch(function(err){
        console.log('error with POST:', err);
        
    })//end ajax
}//end addSong

function getSongs(){
    $.ajax({
        method:'GET',
        url:'/songs'
    }).then(function(response){
        console.log('back from GET with:', response);
        for(song of response){
            $('#songs').append(`<li>${song.artist} ${song.published} ${song.rank} ${song.track}</li>`);
        }
        
    }).catch(function(err){
        console.log('error getting data', err);
        
    })
}