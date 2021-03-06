import * as React from 'react';
import VideoComponent from './video/video.component';

import featureStorageService from '../../../../services/common/feature-storage.service';
import formatService from '../../../../services/common/format.service';

import IMeta from '../../../../interfaces/meta';
import { IYoutubeSnippetResponse, IYoutubeSnippetItem } from './feature-stats.interface';
import { IBaseSongsFeatureData } from '../../../../interfaces/feature';

import { ApiKeys } from '../../../../enums';

import './feature-stats-group.component.scss';

interface IFeatureStatsGroupComponentState {
  videos: IYoutubeSnippetItem[];
  counter: number;
}

interface IFeatureStatsGroupComponentProps {
  meta: IMeta<IBaseSongsFeatureData>;
}

export default class FeatureStatsGroupComponent extends React.Component<IFeatureStatsGroupComponentProps, IFeatureStatsGroupComponentState> {
  constructor(props: IFeatureStatsGroupComponentProps) {
    super(props);
    this.state = {
      videos: [],
      counter: 0,
    };
  }

  componentDidMount() {
    featureStorageService.getFeatureData<IBaseSongsFeatureData>(this.props.meta.id).then(featureData => {
      const videoIds = featureData.data.songs.concat(',');
      fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&part=snippet&key=${ApiKeys.DataApiV3}`)
        .then(res => res.json())
        .then((result: IYoutubeSnippetResponse) => {
          this.setState({
            videos: result.items,
            counter: featureData.data.counter,
          });
        });
    });
  }

  render() {
    let allVideoHtml: any = <div className='feature-group__none'>No videos tracked yet</div>;

    if (this.state.videos.length > 0) {
      allVideoHtml = this.state.videos.map(video =>
        <VideoComponent key={video.id} video={video}></VideoComponent>
      );
    }

    return (
      <div className='feature-group'>
        <div className='feature-group__heading'>
          <div className='feature-group__title'>
            Recently {this.props.meta.actionTitle}:
          </div>
          <div className='feature-group__sub-title'>
            Total <strong>{formatService.formatNumber(this.state.counter)}</strong> video(s) {this.props.meta.actionTitle}
          </div>
        </div>
        <div className='feature-group__videos'>{allVideoHtml}</div>
      </div>
    );
  }
}
