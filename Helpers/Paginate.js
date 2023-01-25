export const Paginate = ({ Page, PageSize }) => {
    if (!Page) Page = 0
    if (!PageSize) PageSize = 5

    const offset = Page * PageSize
    const limit = PageSize;
    return { limit, offset } 
}