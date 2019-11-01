import graphene
from graphene_django import DjangoObjectType
from .models import Track, Like
from users.schema import UserType
from django.db.models import Q

class TrackType(DjangoObjectType):
    class Meta:
        model = Track
    
class LikeType(DjangoObjectType):
    class Meta:
        model = Like


#Query declaration to get data from specific Models    
class Query(graphene.ObjectType):
    tracks = graphene.List(TrackType, search=graphene.String())
    likes = graphene.List(LikeType)

    #the filter searches simultaneously for all title, desc, url and posted_by
    def resolve_tracks(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search)|
                Q(description__icontains=search)|
                Q(url__icontains=search)|
                Q(posted_by__username__icontains=search)
            )
            return Track.objects.filter(filter)
        return Track.objects.all()

    def resolve_likes(self, info):
        return Like.objects.all()

#mutation to store data in table named 'Track'
class CreateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, **kwargs):
        user = info.context.user or None

        if user.is_anonymous:
            raise Exception('Log in to add tracks')

        track = Track(title=kwargs.get('title'),
                      description=kwargs.get('description'),
                      url=kwargs.get('url'),
                      posted_by=user)
        track.save()
        return CreateTrack(track=track)

class UpdateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, track_id, title, url, description):
        user = info.context.user
        track = Track.objects.get(id=track_id)
        if track.posted_by!=user:
            raise Exception("You didn't create this, did you")
        track.title = title
        track.description = description
        track.url = url
        track.save()
        return UpdateTrack(track=track)
    
class DeleteTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user
        track = Track.objects.get(id=track_id)
        print(track)
        if track.posted_by !=user:
            raise Exception("You didn't create this, did You?")
        track.delete()
        return DeleteTrack(track=track)

class CreateLike(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Log in to like")
        track = Track.objects.get(id=track_id)
        if not track:
            raise Exception('Cant find track with given ID')
        Like.objects.create(user=user, track=track)
        return CreateLike(user=user, track=track)

class Mutation(graphene.ObjectType):
    create_track = CreateTrack.Field()
    update_track = UpdateTrack.Field()
    delete_track = DeleteTrack.Field()
    create_like = CreateLike.Field()


