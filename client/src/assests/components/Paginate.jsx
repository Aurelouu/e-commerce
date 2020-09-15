import React from 'react';

import { newPage } from '../js/new_page';

import './css/paginate.css';

export default function Paginate(props) {
    const page = parseInt(props.page);
    const max = parseInt(props.max)

    return (
        <nav className='paginate'>
            {page > 2 ? (
                <a className='paginate-link' href={newPage(1)}>&lt;&lt;</a>
            ) : null}
            {page > 1 ? (
                <a className='paginate-link' href={newPage(page - 1)}>&lt;</a>
            ) : null}
            <span className='paginate-link active'>{page}</span>
            {page < max ? (
                <a className='paginate-link' href={newPage(page + 1)}>&gt;</a>
            ) : null}
            {page < (max - 1) ? (
                <a className='paginate-link' href={newPage(max)}>&gt;&gt;</a>
            ) : null}
        </nav>
    )
}