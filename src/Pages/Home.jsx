import LeftBar from '../Components/LeftBar'
import CenterBar from '../Components/CenterBar'
import RightBar from '../Components/RightBar'

export default function Home() {
    return (
        <div className="w-screen h-screen flex flex-row">
            <LeftBar/>
            <CenterBar/>
            <RightBar/>
        </div>
    )
}
