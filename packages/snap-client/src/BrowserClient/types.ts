export type ItemJSQuery<T = any> = {
	/**
	 * Amount of items per page.
	 */
	per_page: number;

	/**
	 * Page number - used for pagination.
	 */
	page?: number;

	/**
	 * Provide all ids from full text search
	 */
	ids: number[];

	/**
	 * Full text search query string.
	 */
	query?: string;

	/**
	 * Used for sorting. one of sortings key.
	 */
	sort?: string;

	/**
	 * Filtering items based on specific aggregations.
	 * i.e. {tags: ['drama' , 'historical']}
	 */
	filters?: Object;

	/**
	 * Function responsible for items filtering.
	 */
	filter?: (item: SearchResult) => boolean;

	/**
	 * Set to true if you want to always show exact search matches.
	 */
	isExactSearch?: boolean;

	/**
	 * Set to true if you want to remove the stopWordFilter.
	 */
	removeStopWordFilter?: boolean;

	/**
	 * Set to true if you want to return the whole filtered dataset.
	 */
	is_all_filtered_items?: boolean;
};

export type MiniSearchOptions<T = any> = {
	/**
	 * Names of the document fields to be indexed.
	 */
	fields: string[];

	/**
	 * Name of the ID field, uniquely identifying a document.
	 */
	idField?: string;

	/**
	 * Names of fields to store, so that search results would include them. By
	 * default none, so resuts would only contain the id field.
	 */
	storeFields?: string[];

	/**
	 * Function used to extract the value of each field in documents. By default,
	 * the documents are assumed to be plain objects with field names as keys,
	 * but by specifying a custom `extractField` function one can completely
	 * customize how the fields are extracted.
	 *
	 * The function takes as arguments the document, and the name of the field to
	 * extract from it. It should return the field value as a string.
	 */
	extractField?: (document: T, fieldName: string) => string;

	/*
	 * Function used to split a field value into individual terms to be indexed.
	 * The default tokenizer separates terms by space or punctuation, but a
	 * custom tokenizer can be provided for custom logic.
	 *
	 * The function takes as arguments string to tokenize, and the name of the
	 * field it comes from. It should return the terms as an array of strings.
	 * When used for tokenizing a search query instead of a document field, the
	 * `fieldName` is undefined.
	 */
	tokenize?: (text: string, fieldName?: string) => string[];

	/**
	 * Function used to process a term before indexing or search. This can be
	 * used for normalization (such as stemming). By default, terms are
	 * downcased, and otherwise no other normalization is performed.
	 *
	 * The function takes as arguments a term to process, and the name of the
	 * field it comes from. It should return the processed term as a string, or a
	 * falsy value to reject the term entirely.
	 */
	processTerm?: (term: string, fieldName?: string) => string | null | undefined | false;

	/**
	 * Default search options (see the [[SearchOptions]] type and the
	 * [[MiniSearch.search]] method for details)
	 */
	searchOptions?: SearchOptions;
};

export type SearchOptions = {
	/**
	 * Names of the fields to search in. If omitted, all fields are searched.
	 */
	fields?: string[];

	/**
	 * Function used to filter search results, for example on the basis of stored
	 * fields. It takes as argument each search result and should return a boolean
	 * to indicate if the result should be kept or not.
	 */
	filter?: (result: SearchResult) => boolean;

	/**
	 * Key-value object of field names to boosting values. By default, fields are
	 * assigned a boosting factor of 1. If one assigns to a field a boosting value
	 * of 2, a result that matches the query in that field is assigned a score
	 * twice as high as a result matching the query in another field, all else
	 * being equal.
	 */
	boost?: { [fieldName: string]: number };

	/**
	 * Relative weights to assign to prefix search results and fuzzy search
	 * results. Exact matches are assigned a weight of 1.
	 */
	weights?: { fuzzy: number; prefix: number };

	/**
	 * Function to calculate a boost factor for documents. It takes as arguments
	 * the document ID, and a term that matches the search in that document, and
	 * should return a boosting factor.
	 */
	boostDocument?: (documentId: any, term: string) => number;

	/**
	 * Controls whether to perform prefix search. It can be a simple boolean, or a
	 * function.
	 *
	 * If a boolean is passed, prefix search is performed if true.
	 *
	 * If a function is passed, it is called upon search with a search term, the
	 * positional index of that search term in the tokenized search query, and the
	 * tokenized search query. The function should return a boolean to indicate
	 * whether to perform prefix search for that search term.
	 */
	prefix?: boolean | ((term: string, index: number, terms: string[]) => boolean);

	/**
	 * Controls whether to perform fuzzy search. It can be a simple boolean, or a
	 * number, or a function.
	 *
	 * If a boolean is given, fuzzy search with a default fuzziness parameter is
	 * performed if true.
	 *
	 * If a number higher or equal to 1 is given, fuzzy search is performed, with
	 * a maximum edit distance (Levenshtein) equal to the number.
	 *
	 * If a number between 0 and 1 is given, fuzzy search is performed within a
	 * maximum edit distance corresponding to that fraction of the term length,
	 * approximated to the nearest integer. For example, 0.2 would mean an edit
	 * distance of 20% of the term length, so 1 character in a 5-characters term.
	 * The calculated fuzziness value is limited by the `maxFuzzy` option, to
	 * prevent slowdown for very long queries.
	 *
	 * If a function is passed, the function is called upon search with a search
	 * term, a positional index of that term in the tokenized search query, and
	 * the tokenized search query. It should return a boolean or a number, with
	 * the meaning documented above.
	 */
	fuzzy?: boolean | number | ((term: string, index: number, terms: string[]) => boolean | number);

	/**
	 * Controls the maximum fuzziness when using a fractional fuzzy value. This is
	 * set to 6 by default. Very high edit distances usually don't produce
	 * meaningful results, but can excessively impact search performance.
	 */
	maxFuzzy?: number;

	/**
	 * The operand to combine partial results for each term. By default it is
	 * "OR", so results matching _any_ of the search terms are returned by a
	 * search. If "AND" is given, only results matching _all_ the search terms are
	 * returned by a search.
	 */
	combineWith?: string;

	/**
	 * Function to tokenize the search query. By default, the same tokenizer used
	 * for indexing is used also for search.
	 */
	tokenize?: (text: string) => string[];

	/**
	 * Function to process or normalize terms in the search query. By default, the
	 * same term processor used for indexing is used also for search.
	 */
	processTerm?: (term: string) => string | null | undefined | false;
};

export type SearchResult = {
	/**
	 * The document ID
	 */
	id: any;

	/**
	 * List of terms that matched
	 */
	terms: string[];

	/**
	 * Score of the search results
	 */
	score: number;

	/**
	 * Match information, see [[MatchInfo]]
	 */
	match: MatchInfo;

	/**
	 * Stored fields
	 */
	[key: string]: any;
};

/**
 * Match information for a search result. It is a key-value object where keys
 * are terms that matched, and values are the list of fields that the term was
 * found in.
 */
export type MatchInfo = {
	[term: string]: string[];
};

/**
 * The type of auto-suggestions
 */
export type Suggestion = {
	/**
	 * The suggestion
	 */
	suggestion: string;

	/**
	 * Suggestion as an array of terms
	 */
	terms: string[];

	/**
	 * Score for the suggestion
	 */
	score: number;
};
