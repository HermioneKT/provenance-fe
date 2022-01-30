import React, {Dispatch, SetStateAction} from 'react';

export interface RecommendationContextState {
    type: string,
    data: any
}

export interface RecommendationStateProperties {
    recommendationState: RecommendationContextState,
    setRecommendationState: Dispatch<SetStateAction<RecommendationContextState>>
}

export const recommendationContextDefaultValue: RecommendationStateProperties = {
    recommendationState: {
        type: 'house',
        data: null
    },
    setRecommendationState: (state) => {}

}

const RecommendationContext = React.createContext<RecommendationStateProperties>(recommendationContextDefaultValue);


export default RecommendationContext;