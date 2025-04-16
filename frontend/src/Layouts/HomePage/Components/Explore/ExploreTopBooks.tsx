import './ExploreTopBooks.css'

export const ExploreTopBooks = ()=>{
    return(
        <div className="ExploreTopBooks p-5 mb-4 bg-dark">
            <div className='container-fluid py-5 text-white d-flex justify-content-center align-items-center'>
                <div >
                    <h1 className='display-5 fw-bold'>Find your next adventure</h1>
                    <p className='col-md-8 fs-4'>Where whould you like to go next?</p>
                    <a type='button' className='btn btn-dark btn-lg text-white' href="#">Explore top books</a>
                </div>
            </div>
        </div>
    );
};