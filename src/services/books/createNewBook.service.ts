import { AppDataSource } from "../../data-source";
import { AppError } from "../../errors";

import { IBooksRequest, IBooksResponse } from "../../interfaces";
import { Books } from "../../entities/books.entity";
import { Categories } from "../../entities/categories.entity";
import { BooksCategories } from "../../entities/books_categories.entity";

const createNewBookService = async (dataBook: any) => {
  const categoryBody = dataBook.categories;
  const repositoryBooks = AppDataSource.getRepository(Books);
  const repositoryCategories = AppDataSource.getRepository(Categories);
  const repositoryBooksCategories =
    AppDataSource.getRepository(BooksCategories);

  const findBook = await repositoryBooks.findOne({
    where: { name: dataBook.name },
    withDeleted: true,
  });

  if (findBook) {
    throw new AppError("Book already registered in our database", 400);
  }

  const categoryExists = await repositoryCategories.findOneBy({
    category_name: dataBook.category,
  });
  if (!categoryExists) {
    throw new AppError("category not exists", 400);
  }

  const instanceBook = repositoryBooks.create({
    ...dataBook,
    category: categoryExists.id,
  });
  await repositoryBooks.save(instanceBook);
  const registredBook = await repositoryBooks.findOneBy({
    name: dataBook.name,
  });
  const bookcategoryRegister = repositoryBooksCategories.create({
    book: registredBook,
    category: categoryExists,
  });
  await repositoryBooksCategories.save(bookcategoryRegister);

  // const instanceOfBookCreated= {...instanceBook,
  // dataBook.name}
  return instanceBook;
};

export default createNewBookService;
