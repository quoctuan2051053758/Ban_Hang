module.exports =(query)=>{
    let fillterStatus=[
        {
            name:"Tất cả",
            status:"",
            class:""
        },
        {
            name:"Hoạt động",
            status:"active"
        },
        {
            name:"ngừng hoạt động",
            status:"inactive"
        }
    ]

    if(query.status){
        const index = fillterStatus.findIndex(item=>item.status==query.status)
        fillterStatus[index].class="active";
    }else{
        const index = fillterStatus.findIndex(item=>item.status=="")
        fillterStatus[index].class="active";
    }
    return fillterStatus;
}