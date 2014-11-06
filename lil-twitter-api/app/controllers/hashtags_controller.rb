class HashtagsController < ApplicationController
  def popular
    hashtags = Hashtag.joins(:tweet_tags).select('hashtags.name, count(hashtag_id) as "hashtag_count"') .group("hashtags.id") .order('hashtag_count desc') .limit(10)
    tag_name = hashtags.map { |tag| tag.name }
    render json: tag_name.to_json
  end
end
