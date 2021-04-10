def title_reformat(title):
    movie_name = title.split('(')[0]
    split_by_comma = movie_name.split(', ')
    result = split_by_comma[0] # if no commas
    if len(split_by_comma) > 1:
        prefixed_string = split_by_comma[-1]

        for i in range(len(split_by_comma) - 1):
            if i == 0:
                prefixed_string += split_by_comma[i]
            else:
                prefixed_string += ', ' + split_by_comma[i]

        result = prefixed_string
    
    result = result.strip()
    return result