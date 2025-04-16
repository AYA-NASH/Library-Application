import { FC} from "react";

export const ReturnBook:FC<{imgPath: string}> = ({imgPath})=>{
    return(
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
        
            <div className='text-center'>
                <img 
                    src={imgPath}
                    width={151}
                    height={233}
                    alt='book'
                />
                <h6 className='mt-2'></h6>
                <p>Luv2code</p>
                <a className='btn btn-dark text-white' href='#'>Reserve</a>
            </div>
        </div>
    );
}