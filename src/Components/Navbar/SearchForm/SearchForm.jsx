import React,{useState} from 'react'
import { handleSearch } from './SearchForm.js'
import { Search } from 'lucide-react'
const SearchForm = ({setCourses,modalState,setModalState}) => {
  const [loadingFlag,setLoadingFlag]=useState(false)
  const [query,setQuery]=useState('')
    return (
    <form  className='flex  relative '>
        <input  value={query} placeholder='search for courses' onChange={(e)=>setQuery(e.target.value)}  aria-label='search for course field' className='rounded-md shadow-lg p-2' type="text" name="course" id="course" />
        <button onClick={handleSearch(query,setCourses,setModalState,setLoadingFlag)} className='absolute right-1 top-1/2 -translate-y-1/2' aria-label='send your search button' ><Search cursor={'pointer'} color='black' /></button>
    </form>
)
}

export default SearchForm