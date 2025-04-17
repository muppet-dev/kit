import {
  type JSX,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type PlaygroundContextType = ReturnType<typeof usePlaygroundManager>;

const PlaygroundContext = createContext<PlaygroundContextType | null>(null);

export const PlaygroundProvider = (
  props: PropsWithChildren<PlaygroundManagerProps>,
) => {
  const values = usePlaygroundManager({ grounds: props.grounds });

  return (
    <PlaygroundContext.Provider value={values}>
      {props.children}
    </PlaygroundContext.Provider>
  );
};

type PlaygroundManagerProps = {
  grounds: {
    name: string;
    label: string;
    icon: () => JSX.Element;
    component: () => JSX.Element;
  }[];
};

function usePlaygroundManager(props: PlaygroundManagerProps) {
  const [grounds, setGrounds] = useState(props.grounds);
  const [activeGround, setActiveGround] = useState(grounds[0]);

  const changeGround = (ground: string) => {
    const newGround = grounds.find((g) => g.name === ground);
    if (newGround) {
      setActiveGround(newGround);
    }
  };

  return {
    grounds,
    activeGround,
    changeGround,
  };
}

export const usePlayground = () => {
  const context = useContext(PlaygroundContext);

  if (!context)
    throw new Error("Missing PlaygroundContext.Provider in the tree!");

  return context;
};
