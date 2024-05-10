import Cookies from 'js-cookies'
export const handleSearch=(query,setCourses,setModalState,setLoadingFlag)=>async(e)=>{
    e.preventDefault()
    try{

        if(!query)
                return setModalState({message:'please specify what you are looking for',status:400,errorFlag:true,hideFlag:false})
        setLoadingFlag(true)
        const {data}=await api.getCourses(query)
        setCourses(data.courses)
        setModalState({message:'courses were fetched successfull',status:200,errorFlag:false,hideFlag:false})
        setLoadingFlag(false)
        
    }catch({response}){
        console.error(response)
        setLoadingFlag(false)
        setModalState({message:'no courses matched what you are looking for.',status:404,errorFlag:true,hideFlag:false})
    }
}